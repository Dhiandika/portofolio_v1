import os
import glob
import json

# 1. Update keystatic.config.ts
with open('keystatic.config.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("directory: 'public/images", "directory: 'src/assets/images")

# Be careful with publicPath. Keystatic uses publicPath for the frontmatter output.
# If we set publicPath to '/src/assets/images/', Astro might not like it.
# Wait, Astro import.meta.glob works with '/src/assets/images/...'.
# If Keystatic writes '/src/assets/images/...', then Astro will treat it as an absolute path to the root.
# This actually makes mapping MUCH easier! We don't even need relative paths in JSONs!
# So publicPath: '/src/assets/images/'
content = content.replace("publicPath: '/images", "publicPath: '/src/assets/images")

with open('keystatic.config.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update all JSON and MD files in src/content
files = glob.glob('src/content/**/*.json', recursive=True)
files += glob.glob('src/content/**/*.md', recursive=True)
files += glob.glob('src/content/**/*.mdx', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        file_content = f.read()
    
    if '"/images/' in file_content or '(/images/' in file_content:
        new_content = file_content.replace('"/images/', '"/src/assets/images/')
        new_content = new_content.replace('(/images/', '(/src/assets/images/')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Migration completed successfully.")
