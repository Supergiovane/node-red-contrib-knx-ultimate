#!/usr/bin/env python3

"""
Generate SVG buttons for the multi-language documentation links in README.md.

The artwork follows the KNX-inspired badge the user provided:
 - Soft green capsule with side tabs
 - Left control panel hosting a circular KNX refresh icon
 - Right body with a compact language pill and CTA copy

Each button is written as an SVG so rendering stays crisp on GitHub.
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "img" / "buttons"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BUTTON_SPEC: List[Tuple[str, str, str]] = [
    ("en", "English", "Go to documentation"),
    ("it", "Italiano", "Vai alla documentazione"),
    ("de", "Deutsch", "Zur Dokumentation"),
    ("fr", "Français", "Accéder à la documentation"),
    ("es", "Español", "Ir a la documentación"),
    ("zh-CN", "中文", "前往文档"),
]

WIDTH = 420
HEIGHT = 130
RADIUS = 44
TAB_WIDTH = 20
TAB_HEIGHT = 80
LEFT_PANEL_WIDTH = 130
ICON_RADIUS = 36
TEXT_START_X = TAB_WIDTH + LEFT_PANEL_WIDTH + 36

BODY_FILL = "#C7E8C1"
LEFT_FILL = "#BADFB2"
BORDER = "#B1BCB0"
TAB_FILL = "#CECECE"
KNX_WHITE = "#FFFFFF"
LANG_PILL_FILL = "#F4FBF4"
LANG_PILL_TEXT = "#3B7256"
TEXT_COLOUR = "#1C4430"

LATIN_FONT_STACK = "'Inter','Helvetica Neue',Helvetica,Arial,sans-serif"
CJK_FONT_STACK = "'PingFang SC','Microsoft YaHei','Heiti SC','Noto Sans CJK SC','Arial Unicode MS',sans-serif"


def escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def has_cjk(text: str) -> bool:
    for ch in text:
        code = ord(ch)
        if (
            0x4E00 <= code <= 0x9FFF
            or 0x3400 <= code <= 0x4DBF
            or 0x20000 <= code <= 0x2A6DF
            or 0x2A700 <= code <= 0x2B73F
            or 0x2B740 <= code <= 0x2B81F
            or 0x2B820 <= code <= 0x2CEAF
        ):
            return True
    return False


def wrap_caption(caption: str) -> List[str]:
    if has_cjk(caption) or " " not in caption:
        return [caption]
    words = caption.split()
    lines: List[str] = []
    current = words[0]
    max_len = 20
    for word in words[1:]:
        tentative = f"{current} {word}"
        if len(tentative) <= max_len:
            current = tentative
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def language_pill_width(label: str) -> float:
    if has_cjk(label):
        return 110.0
    # crude width estimate tuned for uppercase/latin strings
    base = 80.0
    per_char = 13.5
    return max(base, 28.0 + per_char * len(label))


def create_button(code: str, label: str, caption: str) -> None:
    accent_width = language_pill_width(label)
    accent_height = 34
    accent_x = TEXT_START_X
    accent_y = 38

    lines = wrap_caption(caption)
    line_height = 28
    block_height = line_height * len(lines)
    first_line_y = 86 - block_height / 2 + line_height / 2

    cx = TAB_WIDTH + LEFT_PANEL_WIDTH / 2
    cy = HEIGHT / 2
    arc_radius = ICON_RADIUS - 10
    arc_start_x = cx - arc_radius
    arc_start_y = cy + 8
    arc_end_x = cx + arc_radius - 4
    arc_end_y = cy - 18

    arrow_tip_x = cx + ICON_RADIUS + 10
    arrow_tip_y = cy
    arrow_base_top = cy - 8
    arrow_base_bottom = cy + 8

    caption_font = CJK_FONT_STACK if has_cjk(" ".join(lines)) else LATIN_FONT_STACK
    label_font = CJK_FONT_STACK if has_cjk(label) else LATIN_FONT_STACK
    knx_font = LATIN_FONT_STACK

    svg = f"""<svg width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{escape(caption)}">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#7ba684" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <rect x="{TAB_WIDTH}" y="0" width="{WIDTH - 2 * TAB_WIDTH}" height="{HEIGHT}" rx="{RADIUS}" fill="{BODY_FILL}" stroke="{BORDER}" stroke-width="3"/>
  </g>
  <rect x="0" y="{(HEIGHT - TAB_HEIGHT) / 2}" width="{TAB_WIDTH}" height="{TAB_HEIGHT}" rx="12" fill="{TAB_FILL}" stroke="{BORDER}" stroke-width="2"/>
  <rect x="{WIDTH - TAB_WIDTH}" y="{(HEIGHT - TAB_HEIGHT) / 2}" width="{TAB_WIDTH}" height="{TAB_HEIGHT}" rx="12" fill="{TAB_FILL}" stroke="{BORDER}" stroke-width="2"/>
  <rect x="{TAB_WIDTH}" y="8" width="{LEFT_PANEL_WIDTH}" height="{HEIGHT - 16}" rx="{RADIUS - 10}" fill="{LEFT_FILL}"/>
  <line x1="{TAB_WIDTH + LEFT_PANEL_WIDTH}" y1="18" x2="{TAB_WIDTH + LEFT_PANEL_WIDTH}" y2="{HEIGHT - 18}" stroke="{BORDER}" stroke-width="3"/>
  <circle cx="{cx}" cy="{cy}" r="{ICON_RADIUS}" stroke="{KNX_WHITE}" stroke-width="4" fill="none"/>
  <path d="M {arc_start_x:.2f} {arc_start_y:.2f} A {arc_radius:.2f} {arc_radius:.2f} 0 1 1 {arc_end_x:.2f} {arc_end_y:.2f}" stroke="{KNX_WHITE}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <polygon points="{arc_end_x - 8:.2f},{arc_end_y - 6:.2f} {arrow_tip_x:.2f},{arrow_tip_y:.2f} {arc_end_x - 8:.2f},{arc_end_y + 6:.2f}" fill="{KNX_WHITE}"/>
  <text x="{cx}" y="{cy - 18}" text-anchor="middle" font-family={knx_font} font-weight="700" font-size="20" fill="{KNX_WHITE}">KNX</text>
  <rect x="{accent_x}" y="{accent_y}" width="{accent_width}" height="{accent_height}" rx="{accent_height / 2}" fill="{LANG_PILL_FILL}" stroke="{BORDER}" stroke-width="1.5"/>
  <text x="{accent_x + accent_width / 2}" y="{accent_y + accent_height / 2 + 2}" text-anchor="middle" font-family={label_font} font-size="18" font-weight="600" fill="{LANG_PILL_TEXT}" dominant-baseline="middle">{escape(label)}</text>"""

    for index, line in enumerate(lines):
        line_y = first_line_y + index * line_height
        svg += f"""
  <text x="{TEXT_START_X}" y="{line_y}" text-anchor="start" font-family={caption_font} font-size="24" font-weight="600" fill="{TEXT_COLOUR}">{escape(line)}</text>"""

    svg += "\n</svg>\n"

    out_path = OUTPUT_DIR / f"doc-{code}.svg"
    out_path.write_text(svg, encoding="utf-8")
    print(f"Generated {out_path.relative_to(ROOT)}")


def main() -> None:
    for code, label, caption in BUTTON_SPEC:
        create_button(code, label, caption)


if __name__ == "__main__":
    main()
