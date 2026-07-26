import os
import re

new_p = '''const P = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  panel: "var(--color-panel)",
  border: "var(--color-border)",
  text1: "var(--color-text1)",
  text2: "var(--color-text2)",
  text3: "var(--color-text3)",
  coral: "var(--color-coral)",
  coralSoft: "var(--color-coralSoft)",
  amber: "var(--color-amber)",
  violet: "var(--color-violet)",
  blue: "var(--color-blue)",
  green: "var(--color-green)",
  red: "var(--color-red)",
  glow: "var(--color-glow)",
} as const'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match the old P object
    pattern = r'const P = \{.*?\} as const'
    
    if re.search(pattern, content, flags=re.DOTALL):
        new_content = re.sub(pattern, new_p, content, flags=re.DOTALL)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done palette swap to CSS vars")
