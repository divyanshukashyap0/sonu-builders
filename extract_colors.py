from PIL import Image
from collections import Counter

def get_dominant_colors(image_path, num_colors=3):
    image = Image.open(image_path)
    image = image.convert('RGB')
    image = image.resize((150, 150))
    pixels = list(image.getdata())
    counts = Counter(pixels)
    return counts.most_common(num_colors)

colors = get_dominant_colors('logo.png')
print("Dominant Colors:")
for color, count in colors:
    print(f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}")
