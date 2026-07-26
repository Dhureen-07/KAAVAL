import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('rounded-2xl', 'rounded-[28px]')
    new_content = new_content.replace('rounded-xl', 'rounded-[20px]')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated border radii in {filepath}")

for root, dirs, files in os.walk(r'c:\Users\ASUS\Desktop\KAAVAL\src\app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done rounding")
