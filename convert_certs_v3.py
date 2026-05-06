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

PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
CONTENT_DIR.mkdir(parents=True, exist_ok=True)

existing_slugs = set()
for json_file in CONTENT_DIR.glob("*.json"):
    existing_slugs.add(json_file.stem)

def create_slug(title, year):
    # Format: [tahun]-[nama-sertifikat-singkat]
    base_name = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    # Batasi panjang base_name agar slug tidak kepanjangan
    base_name = "-".join(base_name.split('-')[:5]) 
    
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

prompt = """
Analyze this certificate with extremely high specificity and technical accuracy. Extract the information and format it EXACTLY as a JSON object, without markdown formatting or backticks.

{
  "title": "Exact Full Title including role (e.g. 'Peserta', 'Anggota', 'Lulusan Terbaik') and level (Beginner/Intermediate/Advanced) if present.",
  "title_id": "Exact Full Title translated to Indonesian (if not already).",
  "issuer": "Issuing Organization",
  "date": "Month Year (e.g., October 2023 or 2023 if month is missing)",
  "year": "Extract just the 4 digit year, e.g. 2023",
  "category": "Must be exactly one of: Course, Bootcamp, Event, Competition, Certification, Organization, Appreciation",
  "tags": ["Tag1", "Tag2"],
  "description": "Exactly 2 technical sentences. 1st sentence MUST FOLLOW THIS PATTERN: 'Focuses on [Main Topic/Technology] specifically in [Detail].' 2nd sentence MUST FOLLOW THIS PATTERN: 'Validates proficiency in [Technical Skill].' DO NOT use generic phrases like 'Earned a certificate'.",
  "description_id": "Accurate technical translation of the description to Indonesian.",
  "credentialId": "Credential ID if visible, else empty string"
}

Categorization Rules:
1. Organization: For certificates related to Himpunan (HMP) or kepanitiaan (committee).
2. Appreciation: For 'Certificate of Appreciation' that is NOT a course/competition.
3. Bootcamp: For comprehensive programs like Bangkit Academy.
4. Certification: For Google, AWS, or major professional technical certifications.
5. Competition: For hackathons or lomba.
6. Course/Event: For standard courses or webinars.

Tagging Rules (Multi-label array):
1. Must include at least 1 Domain Tag (e.g. Cloud Computing, Full Stack Development, Machine Learning, Mobile Development, Artificial Intelligence).
2. Must include specific Technology Tags mentioned (e.g. GCP, AWS, React, Flask, Python, TailwindCSS, TensorFlow).
3. Special Tags if applicable: "SIBI" (for sign language research), "Bangkit Academy", "Leadership" (for organization/committee).
"""

def call_gemini(img_pil):
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[img_pil, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )
    return json.loads(response.text)

def process_file(file_path, current_idx, total_files):
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
        print(f"[FAILED] API Error (Tersimpan di failed_log.txt)")
        log_failed(file_path.name, f"API Error: {e}")
        return False, ""
        
    title = data.get('title', 'Unknown Certificate')
    year = data.get('year', '')
    slug = create_slug(title, year)
    
    # Save Image
    target_img_dir = PUBLIC_IMG_DIR / slug
    target_img_dir.mkdir(parents=True, exist_ok=True)
    target_img_path = target_img_dir / f"image{final_ext}"
    
    img_pil.save(target_img_path, "JPEG", quality=85)
    
    # Validate category
    valid_categories = ['Course', 'Bootcamp', 'Event', 'Competition', 'Certification', 'Organization', 'Appreciation']
    cat = data.get("category", "Course")
    if cat not in valid_categories:
        cat = "Course"

    # Save JSON
    json_path = CONTENT_DIR / f"{slug}.json"
    keystatic_data = {
        "title": title,
        "title_id": data.get("title_id", ""),
        "issuer": data.get("issuer", ""),
        "date": data.get("date", ""),
        "category": cat,
        "tags": data.get("tags", []),
        "image": f"/images/certificates/{slug}/image{final_ext}",
        "link": "",
        "credentialId": data.get("credentialId", ""),
        "description": data.get("description", ""),
        "description_id": data.get("description_id", "")
    }
    
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(keystatic_data, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] -> {slug}")
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
        
        # Rate limit protection (12s per iterasi sesuai permintaan)
        if idx < total:
            time.sleep(12)
            
    # Print summary table in terminal
    print("\n\n=== SUMMARY REPORT ===")
    print("| No | Nama File Asli | Slug | Status |")
    print("|---|---|---|---|")
    for r in results:
        print(f"| {r[0]} | {r[1]} | {r[2]} | {r[3]} |")
        
if __name__ == "__main__":
    main()
