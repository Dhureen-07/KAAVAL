import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('text-white', 'text-slate-900')
    new_content = new_content.replace('text-white/60', 'text-slate-600')
    new_content = new_content.replace('text-white/80', 'text-slate-700')
    new_content = new_content.replace('text-white/40', 'text-slate-400')
    new_content = new_content.replace('text-[#FFFFFF]', 'text-[#0F172A]')
    
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

print("Done text swap")
