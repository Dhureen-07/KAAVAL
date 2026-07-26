import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('text-slate-900', 'text-[#1D1D1F]')
    new_content = new_content.replace('text-slate-800', 'text-[#1D1D1F]')
    new_content = new_content.replace('text-slate-700', 'text-[#1D1D1F]')
    new_content = new_content.replace('text-slate-600', 'text-[#86868B]')
    new_content = new_content.replace('text-slate-500', 'text-[#86868B]')
    new_content = new_content.replace('text-slate-400', 'text-[#86868B]')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated text colors in {filepath}")

for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
            
for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done iOS text swap")
