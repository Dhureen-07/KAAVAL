import urllib.request
import re

url = 'https://pin.it/2QIFTCyDu'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    if match:
        img_url = match.group(1)
        print('Image URL:', img_url)
        urllib.request.urlretrieve(img_url, 'c:/Users/ASUS/Desktop/KAAVAL/pinterest_ref.jpg')
        print('Saved to c:/Users/ASUS/Desktop/KAAVAL/pinterest_ref.jpg')
    else:
        print('Could not find image in page.')
except Exception as e:
    print('Error:', e)
