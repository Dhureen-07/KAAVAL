import urllib.request
import re

url = 'https://pin.it/2ZTwITBrL'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    # The URL redirects, we get the redirected page HTML
    html = response.read().decode('utf-8')
    match = re.search(r'<meta [^>]*property="og:image" [^>]*content="([^"]+)"', html)
    if not match:
        match = re.search(r'<meta [^>]*name="og:image" [^>]*content="([^"]+)"', html)
    
    if match:
        img_url = match.group(1)
        print('Image URL:', img_url)
        urllib.request.urlretrieve(img_url, 'c:/Users/ASUS/Desktop/KAAVAL/pinterest_ref2.jpg')
        print('Saved to c:/Users/ASUS/Desktop/KAAVAL/pinterest_ref2.jpg')
    else:
        print('Could not find image in page.')
except Exception as e:
    print('Error:', e)
