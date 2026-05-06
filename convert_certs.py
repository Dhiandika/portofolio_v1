import os
import json
import re
import time
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image
from dotenv import load_dotenv
from tenacity import retry, wait_exponential, stop_after_attempt

load_dotenv()

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GEMINI_API_KEY and not GROQ_API_KEY:
    print("ERROR: Neither GEMINI_API_KEY nor GROQ_API_KEY is set in .env file.")
    exit(1)

# Import AI Clients
try:
    from google import genai
    from google.genai import types
    gemini_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
except ImportError:
    gemini_client = None

try:
    import groq
    groq_client = groq.Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
except ImportError:
    groq_client = None

# Import OCR
try:
    import pytesseract
    # Jika di Windows dan Tesseract belum masuk PATH, uncomment dan sesuaikan path di bawah ini:
    # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
except ImportError:
    pytesseract = None
    print("WARNING: pytesseract not installed. Image OCR will be skipped.")

# Dirs
ROOT_DIR = Path(__file__).parent
CERT_DIR = ROOT_DIR / "sertifikat"
PUBLIC_IMG_DIR = ROOT_DIR / "public" / "images" / "certificates"
CONTENT_DIR = ROOT_DIR / "src" / "content" / "certificates"
CACHE_FILE = ROOT_DIR / "processed_certs.txt"
OCR_CACHE_DIR = ROOT_DIR / "ocr_cache"

PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
CONTENT_DIR.mkdir(parents=True, exist_ok=True)
OCR_CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Load cache
processed_files = set()
if CACHE_FILE.exists():
    with open(CACHE_FILE, 'r', encoding='utf-8') as f:
        processed_files = set(line.strip() for line in f)

existing_slugs = set()
for json_file in CONTENT_DIR.glob("*.json"):
    existing_slugs.add(json_file.stem)

def create_slug(title):
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    if not slug:
        slug = "certificate"
    original_slug = slug
    counter = 2
    while slug in existing_slugs:
        slug = f"{original_slug}-{counter}"
        counter += 1
    existing_slugs.add(slug)
    return slug

prompt_template = """Extract certificate info as JSON from this text. Format EXACTLY as a JSON object, no markdown.
{{
  "title": "Certificate Title",
  "title_id": "Certificate Title in Indonesian",
  "issuer": "Issuing Organization",
  "date": "Month Year (e.g., October 2023 or 2023)",
  "category": "Course, Bootcamp, Event, Competition, or Certification",
  "description": "A short summary (1-2 sentences) in English",
  "description_id": "A short summary (1-2 sentences) in Indonesian",
  "credentialId": "Credential ID if visible, else empty string"
}}
Rules:
1. 'category': Google/Bangkit=Certification, Bootcamp=Bootcamp, Webinar=Event, Standard=Course.
Raw Text:
{ocr_text}
"""

@retry(wait=wait_exponential(multiplier=2, min=5, max=30), stop=stop_after_attempt(3))
def call_groq_text(text):
    if not groq_client:
        raise Exception("Groq client not initialized")
    try:
        response = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON parser. Output ONLY valid JSON, no markdown or backticks."},
                {"role": "user", "content": prompt_template.format(ocr_text=text)}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
        )
        content = response.choices[0].message.content
        # Sometimes LLM wraps JSON in markdown block even if told not to
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
            
        return json.loads(content)
    except Exception as e:
        print(f"    [Groq Internal Error] {e}")
        raise

@retry(wait=wait_exponential(multiplier=2, min=5, max=30), stop=stop_after_attempt(3))
def call_gemini_text(text):
    if not gemini_client:
        raise Exception("Gemini client not initialized")
    response = gemini_client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt_template.format(ocr_text=text)],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1,
        ),
    )
    return json.loads(response.text)

def process_file(file_path):
    if file_path.name in processed_files:
        print(f"Skipping (already processed): {file_path.name}")
        return

    print(f"Processing: {file_path.name}")
    
    img_pil = None
    ext = file_path.suffix.lower()
    pdf_text = ""
    
    if ext == '.pdf':
        try:
            doc = fitz.open(file_path)
            page = doc.load_page(0)
            pdf_text = page.get_text().strip()
            pix = page.get_pixmap(dpi=150)
            img_pil = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            doc.close()
            final_ext = ".jpg"
        except Exception as e:
            print(f"  Error reading PDF {file_path.name}: {e}")
            return
    elif ext in ['.jpg', '.jpeg', '.png']:
        try:
            img_pil = Image.open(file_path).convert("RGB")
            final_ext = ".jpg"
        except Exception as e:
            print(f"  Error reading Image {file_path.name}: {e}")
            return
    else:
        return

    # OCR / Text Extraction Step
    ocr_file = OCR_CACHE_DIR / f"{file_path.name}.txt"
    ocr_text = ""
    
    if ocr_file.exists():
        print("  -> Membaca dari cache OCR...")
        with open(ocr_file, 'r', encoding='utf-8') as f:
            ocr_text = f.read()
    else:
        print("  -> Melakukan ekstraksi teks (OCR)...")
        if ext == '.pdf' and len(pdf_text) > 50:
            ocr_text = pdf_text
        else:
            if pytesseract:
                try:
                    ocr_text = pytesseract.image_to_string(img_pil)
                except Exception as e:
                    print(f"  OCR Error: {e} (Pastikan Tesseract terinstal di OS Anda)")
                    ocr_text = ""
            else:
                print("  pytesseract tidak tersedia, teks kosong.")
                
        if ocr_text.strip():
            with open(ocr_file, 'w', encoding='utf-8') as f:
                f.write(ocr_text)

    if not ocr_text.strip():
        print(f"  Gagal: Tidak ada teks yang diekstrak untuk {file_path.name}")
        return

    # AI Processing Step
    data = None
    if groq_client:
        try:
            print("  -> Mengirim ke Groq (Metode Utama)...")
            data = call_groq_text(ocr_text)
        except Exception as e:
            print(f"  Groq API Error: {e}")
    
    # Backup AI
    if data is None and gemini_client:
        try:
            print("  -> Groq gagal. Mengalihkan ke Gemini (Metode Backup)...")
            data = call_gemini_text(ocr_text)
        except Exception as e:
            print(f"  Gemini API Error: {e}")
            
    if not data:
        print(f"  Gagal: Kedua AI gagal merespons untuk {file_path.name}")
        return
        
    title = data.get('title', 'Unknown Certificate')
    slug = create_slug(title)
    
    # Save Image
    target_img_dir = PUBLIC_IMG_DIR / slug
    target_img_dir.mkdir(parents=True, exist_ok=True)
    target_img_path = target_img_dir / f"image{final_ext}"
    
    img_pil.save(target_img_path, "JPEG", quality=85)
    
    # Validate category
    valid_categories = ['Course', 'Bootcamp', 'Event', 'Competition', 'Certification']
    cat = data.get("category", "Course")
    if cat not in valid_categories:
        cat = "Course"
        
    if "Google" in data.get("issuer", "") or "Google Skills" in file_path.parts:
        cat = "Certification"

    # Save JSON
    json_path = CONTENT_DIR / f"{slug}.json"
    keystatic_data = {
        "title": data.get("title", ""),
        "title_id": data.get("title_id", ""),
        "issuer": data.get("issuer", ""),
        "date": data.get("date", ""),
        "category": cat,
        "image": f"/images/certificates/{slug}/image{final_ext}",
        "link": "",
        "credentialId": data.get("credentialId", ""),
        "description": data.get("description", ""),
        "description_id": data.get("description_id", "")
    }
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(keystatic_data, f, indent=2, ensure_ascii=False)
        
    print(f"  Sukses -> {slug}")
    
    # Log success to cache
    with open(CACHE_FILE, 'a', encoding='utf-8') as f:
        f.write(file_path.name + "\n")
    processed_files.add(file_path.name)
    
    # Delay ringan untuk rate limit
    time.sleep(1)

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
                
    print(f"Ditemukan {len(files)} file untuk diproses.")
    
    for f in files:
        process_file(f)
        
    print("Selesai memproses semua file.")

if __name__ == "__main__":
    main()
