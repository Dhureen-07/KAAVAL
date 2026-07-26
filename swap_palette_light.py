import os
import re

new_p = '''const P = {
  background: "#F2EFEA",
  surface: "rgba(255, 255, 255, 0.45)",
  panel: "rgba(255, 255, 255, 0.7)",
  border: "rgba(255, 255, 255, 0.9)",
  text1: "#0F172A",
  text2: "#475569",
  text3: "#94A3B8",
  coral: "#8B5CF6",
  coralSoft: "#C084FC",
  amber: "#2DD4BF",
  violet: "#8B5CF6",
  blue: "#3B82F6",
  green: "#10B981",
  red: "#EF4444",
  glow: "rgba(255, 255, 255, 1)",
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

print("Done palette swap")
