import os
import re

new_p = '''const P = {
  background: "#F5F5F7",
  surface: "rgba(255, 255, 255, 0.75)",
  panel: "rgba(255, 255, 255, 0.85)",
  border: "rgba(255, 255, 255, 0.9)",
  text1: "#1D1D1F",
  text2: "#86868B",
  text3: "#D2D2D7",
  coral: "#007AFF",
  coralSoft: "#E5F1FF",
  amber: "#FF9500",
  violet: "#AF52DE",
  blue: "#007AFF",
  green: "#34C759",
  red: "#FF3B30",
  glow: "rgba(0, 122, 255, 0.15)",
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

print("Done iOS palette swap")
