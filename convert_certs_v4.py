import os
import json
import re
import time
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tenacity import retry, wait_exponential, stop_after_attempt

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY is not set in .env file.")
    exit(1)

client = genai.Client(api_key=API_KEY)

# Dirs
ROOT_DIR = Path(__file__).parent
CERT_DIR = ROOT_DIR / "sertifikat"
PUBLIC_IMG_DIR = ROOT_DIR / "public" / "images" / "certificates"
CONTENT_DIR = ROOT_DIR / "src" / "content" / "certificates"
FAILED_LOG = ROOT_DIR / "failed_log.txt"
CACHE_FILE = ROOT_DIR / "processed_certs_v4.txt"

PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
CONTENT_DIR.mkdir(parents=True, exist_ok=True)

# Load cache
processed_cache = set()
if CACHE_FILE.exists():
    with open(CACHE_FILE, 'r', encoding='utf-8') as f:
        processed_cache = set(line.strip() for line in f if line.strip())

existing_slugs = set()
for json_file in CONTENT_DIR.glob("*.json"):
    existing_slugs.add(json_file.stem)

def create_slug(title, year):
    base_name = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    base_name = "-".join(base_name.split('-')[:6]) 
    
    if not base_name:
        base_name = "certificate"
        
    year_str = str(year).strip() if year else "0000"
    slug = f"{year_str}-{base_name}"
    
    original_slug = slug
    counter = 1
    while slug in existing_slugs:
        slug = f"{original_slug}-{counter:02d}"
        counter += 1
        
    existing_slugs.add(slug)
    return slug

def determine_category(file_path):
    parts = file_path.parts
    if "Course" in parts:
        return "Course"
    if "Event" in parts:
        return "Event"
    if "Bangkit" in parts:
        return "Bootcamp"
    if "Google Skills" in parts:
        return "Certification"
    return None

prompt = """
Analyze this certificate to curate a professional software engineering portfolio. Extract data exactly as JSON.

{
  "title": "Clean, Professional Title. RULES: 1. REMOVE words like 'LULUSAN', 'KEHADIRAN', 'PESERTA', 'SERTIFIKAT', 'MEMULAI PEMROGRAMAN DENGAN', 'BELAJAR DASAR'. 2. For courses, use technical subject ONLY (e.g. 'Python Programming' instead of 'Belajar Dasar Pemrograman Python'). 3. For events, extract the specific catchy title (e.g. the phrase after a colon). 4. For organizations, include full name and year. Do NOT include roles in the title.",
  "issuer": "Issuing Organization",
  "date": "Month Year (e.g., October 2023 or 2023 if month is missing)",
  "year": "Extract just the 4 digit year, e.g. 2023",
  "category_fallback": "Choose one ONLY IF not forced by folder: Organization, Appreciation, Certification",
  "tags": ["Tag1", "Tag2"],
  "description": "Exactly 2 technical sentences. 1. 'Focuses on [Main Tech/Topic] specifically in [Detail].' 2. 'Validates proficiency in [Technical Skill].' DO NOT use generic marketing phrases like 'Earned a certificate'."
}

Role & Tagging Rules:
- Analyze if the person is 'Panitia', 'Ketua', 'Anggota', or 'Peserta'/'Participant'.
- If Panitia/Anggota/Ketua -> MUST add tags: "Leadership", "Committee".
- If Peserta -> MUST add tag: "Participant".
- Always add technical domain tags (e.g. Cloud Computing, Web Development, Machine Learning, Mobile Development, Soft Skills) and specific tech tags (GCP, AWS, React, Python).
- If it's Himpunan TI or similar -> MUST include tag "Leadership" and "Committee" if member.
"""

@retry(wait=wait_exponential(multiplier=1, min=15, max=60), stop=stop_after_attempt(5))
def call_gemini(img_pil):
    # Diganti ke gemini-2.0-flash karena 1.5 tidak didukung dan 2.5-flash memiliki limit harian yang sangat ketat (20/hari)
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=[img_pil, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )
    return json.loads(response.text)

def process_file(file_path, current_idx, total_files):
    if file_path.name in processed_cache:
        print(f"Melewati {current_idx}/{total_files}: {file_path.name} (Sudah diproses)", flush=True)
        return True, "skipped"

    print(f"Memproses {current_idx}/{total_files}: {file_path.name}...", end=" ", flush=True)
    
    img_pil = None
    ext = file_path.suffix.lower()
    
    if ext == '.pdf':
        try:
            doc = fitz.open(file_path)
            page = doc.load_page(0)
            pix = page.get_pixmap(dpi=150)
            img_pil = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            doc.close()
            final_ext = ".jpg"
        except Exception as e:
            print(f"[FAILED] Error reading PDF")
            log_failed(file_path.name, f"PDF read error: {e}")
            return False, ""
    elif ext in ['.jpg', '.jpeg', '.png']:
        try:
            img_pil = Image.open(file_path).convert("RGB")
            final_ext = ".jpg"
        except Exception as e:
            print(f"[FAILED] Error reading Image")
            log_failed(file_path.name, f"Image read error: {e}")
            return False, ""
    else:
        print("[SKIPPED] Unknown extension.")
        return False, ""

    try:
        data = call_gemini(img_pil)
    except Exception as e:
        print(f"[FAILED] API Error")
        log_failed(file_path.name, f"API Error: {e}")
        return False, ""
        
    title = data.get('title', 'Unknown Certificate')
    year = data.get('year', '')
    slug = create_slug(title, year)
    
    target_img_dir = PUBLIC_IMG_DIR / slug
    target_img_dir.mkdir(parents=True, exist_ok=True)
    target_img_path = target_img_dir / f"image{final_ext}"
    
    img_pil.save(target_img_path, "JPEG", quality=85)
    
    cat = determine_category(file_path)
    if not cat:
        cat = data.get("category_fallback", "Organization")
        if cat not in ["Organization", "Appreciation", "Certification"]:
            cat = "Appreciation"

    json_path = CONTENT_DIR / f"{slug}.json"
    keystatic_data = {
        "title": title,
        "issuer": data.get("issuer", ""),
        "date": data.get("date", ""),
        "category": cat,
        "tags": data.get("tags", []),
        "description": data.get("description", ""),
        "image": f"/images/certificates/{slug}/image{final_ext}"
    }
    
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(keystatic_data, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] -> {slug}")
        
        # Save to cache
        with open(CACHE_FILE, 'a', encoding='utf-8') as cf:
            cf.write(f"{file_path.name}\n")
            
        return True, slug
    except Exception as e:
        print(f"[FAILED] JSON Write Error")
        log_failed(file_path.name, f"JSON Error: {e}")
        return False, ""

def log_failed(filename, reason):
    with open(FAILED_LOG, 'a', encoding='utf-8') as f:
        f.write(f"{filename} | {reason}\n")

def main():
    if not CERT_DIR.exists():
        print(f"Directory not found: {CERT_DIR}")
        return
        
    files = []
    for root, _, filenames in os.walk(CERT_DIR):
        for filename in filenames:
            f = Path(root) / filename
            if f.suffix.lower() in ['.pdf', '.jpg', '.jpeg', '.png']:
                files.append(f)
                
    total = len(files)
    print(f"Total files to process: {total}\n")
    
    results = []
    
    for idx, f in enumerate(files, 1):
        success, slug = process_file(f, idx, total)
        status = "Success" if success else "Failed"
        results.append((idx, f.name, slug if slug else "-", status))
        
        # Rate Limit Protection only if actually processed
        if success and slug != "skipped" and idx < total:
            time.sleep(15)
            
    print("\n\n=== SUMMARY REPORT ===")
    print("| No | Nama File Asli | Slug | Status |")
    print("|---|---|---|---|")
    for r in results:
        print(f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} |")
        
if __name__ == "__main__":
    main()
