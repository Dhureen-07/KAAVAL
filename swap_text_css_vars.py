import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('text-[#1D1D1F]', 'text-[var(--color-text1)]')
    new_content = new_content.replace('text-[#86868B]', 'text-[var(--color-text2)]')
    new_content = new_content.replace('text-[#D2D2D7]', 'text-[var(--color-text3)]')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated text colors to CSS vars in {filepath}")

for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
            
for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done text CSS var swap")
