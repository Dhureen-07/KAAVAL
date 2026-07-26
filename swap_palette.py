import os
import re

new_p = '''const P = {
  background: "#4A1C22",
  surface: "#5B242B",
  panel: "#341116",
  border: "rgba(255, 255, 255, 0.04)",
  text1: "#FFFFFF",
  text2: "#F7E5A5",
  text3: "#C49A9C",
  coral: "#E74D44",
  coralSoft: "#FF7B6B",
  amber: "#FBE09B",
  violet: "#7C5CFC",
  blue: "#FFFFFF",
  green: "#22C55E",
  red: "#EF4444",
  glow: "rgba(231, 77, 68, 0.08)",
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

print("Done")
