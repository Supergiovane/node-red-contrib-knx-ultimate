#!/usr/bin/env python3

"""
Generate PNG buttons for the multi-language documentation links used in README.md.
The buttons mimic the inlined gradient styling that GitHub's Markdown renderer strips out.
"""

from pathlib import Path
from typing import Iterable, Tuple

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "img" / "buttons"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BUTTON_SPEC = [
    ("en", "EN", "Go to documentation"),
    ("it", "IT", "Vai alla documentazione"),
    ("de", "DE", "Zur Dokumentation"),
    ("fr", "FR", "Accéder à la documentation"),
    ("es", "ES", "Ir a la documentación"),
    ("zh-CN", "中文", "前往文档"),
]

# Colours
GRADIENT_START = (13, 76, 112)   # #0d4c70
GRADIENT_END = (42, 141, 255)    # lighten to make the button pop
HIGHLIGHT_ALPHA = 90
TEXT_COLOUR = (244, 251, 255, 255)
BADGE_BG = (12, 55, 80, 220)

WIDTH = 420
HEIGHT = 96
RADIUS = 44
PADDING_LEFT = 36
BADGE_DIAMETER = 64
TEXT_OFFSET_X = PADDING_LEFT + BADGE_DIAMETER + 24


def load_font(candidates: Iterable[Tuple[str, int]]) -> ImageFont.FreeTypeFont:
    for path, size in candidates:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except OSError:
                continue
    return ImageFont.load_default()


def create_gradient(width: int, height: int) -> Image:
    gradient = Image.new("RGBA", (width, height))
    for x in range(width):
        t = x / max(1, width - 1)
        r = int(GRADIENT_START[0] + (GRADIENT_END[0] - GRADIENT_START[0]) * t)
        g = int(GRADIENT_START[1] + (GRADIENT_END[1] - GRADIENT_START[1]) * t)
        b = int(GRADIENT_START[2] + (GRADIENT_END[2] - GRADIENT_START[2]) * t)
        for y in range(height):
            gradient.putpixel((x, y), (r, g, b, 255))
    return gradient


def add_highlight(img: Image) -> None:
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    highlight_height = int(img.height * 0.45)
    draw.rounded_rectangle(
        (4, 4, img.width - 4, highlight_height),
        radius=int(RADIUS * 0.8),
        fill=(255, 255, 255, HIGHLIGHT_ALPHA),
    )
    img.alpha_composite(overlay)


def draw_text(
    canvas: ImageDraw.Draw,
    text: str,
    font: ImageFont.FreeTypeFont,
    start_x: int,
    baseline_y: int,
) -> None:
    bbox = canvas.textbbox((0, 0), text, font=font)
    text_height = bbox[3] - bbox[1]
    canvas.text(
        (start_x, baseline_y - text_height / 2),
        text,
        font=font,
        fill=TEXT_COLOUR,
    )


def create_button(code: str, badge_label: str, caption: str) -> None:
    gradient = create_gradient(WIDTH, HEIGHT)

    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, WIDTH - 1, HEIGHT - 1), radius=RADIUS, fill=255)

    button = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    button.paste(gradient, mask=mask)
    add_highlight(button)

    canvas = ImageDraw.Draw(button)

    badge_left = PADDING_LEFT
    badge_top = (HEIGHT - BADGE_DIAMETER) // 2
    badge_right = badge_left + BADGE_DIAMETER
    badge_bottom = badge_top + BADGE_DIAMETER
    canvas.ellipse((badge_left, badge_top, badge_right, badge_bottom), fill=BADGE_BG)

    badge_font = load_font([
        ("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 30),
        ("/System/Library/Fonts/Supplemental/Helvetica Bold.ttf", 30),
        ("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", 30),
        ("/System/Library/Fonts/Supplemental/SFNSDisplay-Bold.otf", 30),
    ])
    caption_font = load_font([
        ("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 32),
        ("/System/Library/Fonts/Supplemental/Helvetica Bold.ttf", 32),
        ("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", 32),
        ("/System/Library/Fonts/Supplemental/SFNSDisplay-Bold.otf", 32),
    ])

    # Draw badge label
    badge_bbox = canvas.textbbox((0, 0), badge_label, font=badge_font)
    badge_text_width = badge_bbox[2] - badge_bbox[0]
    badge_text_height = badge_bbox[3] - badge_bbox[1]
    badge_text_x = badge_left + (BADGE_DIAMETER - badge_text_width) / 2
    badge_text_y = badge_top + (BADGE_DIAMETER - badge_text_height) / 2
    canvas.text((badge_text_x, badge_text_y), badge_label, font=badge_font, fill=TEXT_COLOUR)

    # Draw caption
    caption_y = HEIGHT // 2
    draw_text(canvas, caption, caption_font, TEXT_OFFSET_X, caption_y)

    out_path = OUTPUT_DIR / f"doc-{code}.png"
    button.save(out_path, format="PNG")
    print(f"Generated {out_path.relative_to(ROOT)}")


def main() -> None:
    for code, badge, caption in BUTTON_SPEC:
        create_button(code, badge, caption)


if __name__ == "__main__":
    main()
