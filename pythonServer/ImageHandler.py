from math import ceil
#from PIL import Image
from PIL import *

# Works for levels 1 to 5
# Higher level (closer to 5) -> More pixelized
def pixelize(level: int, image):
    original_size = image.size
    pixels = 60 - level*10
    first_resize = image.resize((pixels, pixels), resample=Image.NEAREST)
    
    final_result = first_resize.resize(original_size, resample=Image.NEAREST)
    
    if level == 0:
        return image
    return final_result