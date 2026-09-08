import os
from PIL import Image

sizes = [16, 32, 48, 64, 128, 256]
images = []

master_512 = Image.open('public/icon.png').convert('RGBA')

for s in sizes:
    file_path = f'public/icon-{s}.png'
    if os.path.exists(file_path):
        img = Image.open(file_path).convert('RGBA')
    else:
        img = master_512.resize((s, s), Image.Resampling.LANCZOS)
    images.append((s, img))

# Pillow saves ICO using base image and append_images
# We use the 256x256 image as the base, and append others
base_img = images[-1][1]
other_imgs = [img for s, img in images[:-1]]

base_img.save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(s, s) for s, img in images],
    append_images=other_imgs
)

print('Assembled public/favicon.ico successfully!')
