---
layout: wiki
title: "Docs-Language-Bar"
lang: zh-CN
permalink: /wiki/zh-CN-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Wiki 翻译 — 操作指南

文档网站以六种语言显示每个页面：英语、意大利语、德语、法语、西班牙语和简体中文。导航栏的语言菜单会自动链接同一页面的各个翻译版本。

## 文件名

- 英文页面没有前缀（例如 `Device.md`）。
- 翻译页面使用前缀 `it-`、`de-`、`fr-`、`es-` 和 `zh-CN-`（例如 `it-Device.md`）。

## Front matter

每个页面都以 front matter 块开头：

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` 必须与文件名前缀一致（没有前缀时为 `en`）。
- 同一页面的所有翻译使用相同的 `translation_key`：导航栏通过它链接各个翻译。
- `npm run wiki:refresh` 会为新页面创建 front matter。

## 检查

- `npm run wiki:validate` 会报告缺少 front matter、`lang` 错误或缺少 `translation_key` 的页面，仍带有旧版 "🌐 Language:" 栏的页面，以及缺少翻译的页面。
- `npm run wiki:fix-langbar` 会修正 `lang` 和 `translation_key` 并移除旧版语言栏。缺少的翻译需要手动编写。
- `_Sidebar.md`、`_Footer.md` 以及 `samples/` 下的页面不会被检查。
