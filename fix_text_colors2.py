import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('text-[var(--color-text1)]', 'text-foreground')
    new_content = new_content.replace('text-[var(--color-text2)]', 'text-muted-foreground')
    new_content = new_content.replace('text-[var(--color-text3)]', 'text-muted-foreground opacity-80')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed text classes in {filepath}")

for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
            
for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\components'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done fixing text colors")
