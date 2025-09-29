import re
from pathlib import Path
from typing import List

from deep_translator import GoogleTranslator

WIKI_ROOT = Path('/Users/massimosaccani/Documents/GitHub/node-red-contrib-knx-ultimate.wiki')
BASE_FILES = [
    'FAQ-Troubleshoot.md',
    'Gateway-configuration.md',
    'GlobalVariable.md',
    'HUE Light.md',
    'KNX Node Configuration.md',
]

LANG_CONFIG = [
    ('fr', 'fr', 'fr-'),
    ('es', 'es', 'es-'),
]

LANG_BAR_ORDER = [
    ('EN', ''),
    ('IT', 'it-'),
    ('DE', 'de-'),
    ('FR', 'fr-'),
    ('ES', 'es-'),
    ('简体中文', 'zh-CN-'),
]


def slugify(title: str) -> str:
    return title.replace(' ', '+')


def build_lang_bar(title: str) -> str:
    slug = slugify(title)
    entries = []
    for label, prefix in LANG_BAR_ORDER:
        entries.append(f'[{label}](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/{prefix}{slug})')
    return f'🌐 Language: ' + ' | '.join(entries)


def split_header_and_body(lines: List[str]):
    idx = 0
    nav_block = []
    if idx < len(lines) and lines[idx].startswith('🌐 Language:'):
        idx += 1
    # capture nav block if present
    nav_start = None
    nav_end = None
    for i in range(idx, len(lines)):
        if lines[i].strip() == '<!-- NAV START -->':
            nav_start = i
        if lines[i].strip() == '<!-- NAV END -->':
            nav_end = i
            break
    if nav_start is not None and nav_end is not None:
        nav_block = lines[nav_start:nav_end + 1]
        idx = nav_end + 1
    # skip potential blank line after nav
    while idx < len(lines) and lines[idx].strip() == '':
        idx += 1
    body = lines[idx:]
    return nav_block, body


def translate_lines(body_lines: List[str], translator: GoogleTranslator) -> List[str]:
    translated = []
    in_fenced_block = False
    fenced_delim = None
    bullet_pattern = re.compile(r'^([ \t]*[*+-]|[ \t]*\d+\.)[ \t]+')

    buffer: List[str] = []

    def safe_translate(text: str) -> str:
        try:
            result = translator.translate(text)
        except Exception:
            result = text
        if result is None:
            result = text
        return result

    def flush_buffer():
        if not buffer:
            return
        chunk = '\n'.join(buffer)
        buffer.clear()
        translated_chunk = safe_translate(chunk)
        translated.extend(str(part) for part in translated_chunk.split('\n'))

    for line in body_lines:
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            flush_buffer()
            translated.append(line)
            if in_fenced_block:
                if stripped.startswith(fenced_delim):
                    in_fenced_block = False
                    fenced_delim = None
            else:
                in_fenced_block = True
                fenced_delim = stripped[:3]
            continue
        if in_fenced_block:
            translated.append(line)
            continue
        if not stripped:
            flush_buffer()
            translated.append(line)
            continue
        # headings or other markdown structures should be translated as a whole line
        if line.startswith('#') or line.startswith('>'):
            flush_buffer()
            translated.append(safe_translate(line))
            continue
        # accumulate paragraphs / list items for batched translation
        buffer.append(line)
    flush_buffer()
    return translated


def ensure_translations():
    for base_name in BASE_FILES:
        base_path = WIKI_ROOT / base_name
        if not base_path.exists():
            print(f"Base page missing: {base_name}")
            continue
        title = base_name[:-3]
        lines = base_path.read_text(encoding='utf-8').splitlines()
        nav_block, body = split_header_and_body(lines)
        for lang_key, lang_code, prefix in LANG_CONFIG:
            target_path = WIKI_ROOT / f'{prefix}{title}.md'
            if target_path.exists():
                # already translated, skip
                continue
            print(f'Translating {base_name} -> {target_path.name} ({lang_key})')
            translator = GoogleTranslator(source='auto', target=lang_code)
            translated_body = translate_lines(body, translator)
            content_lines = [build_lang_bar(title)]
            if nav_block:
                content_lines.extend(nav_block)
            if nav_block and (not translated_body or translated_body[0].strip() != ''):
                content_lines.append('')
            content_lines.extend(translated_body)
            target_path.write_text('\n'.join(content_lines) + '\n', encoding='utf-8')

if __name__ == '__main__':
    ensure_translations()
