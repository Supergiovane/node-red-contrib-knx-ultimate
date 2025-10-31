---
layout: wiki
title: "Docs-Language-Bar"
lang: zh-CN
permalink: /wiki/zh-CN-Docs-Language-Bar
---
---

<h1> <p align ='Center'> Wiki语言栏 - 如何</p> </h1>

使用此模式将语言开关添加到Wiki页面，并在翻译中保持一致的命名。

指南

- 文件名：基本页面，然后是其他语言的前缀：``it-'，`de-，`zh-cn--（例如，``hue light.md.md\`，it-hue light light.md''）。
- 第一行（必需）：添加与地球图标的语言栏，并链接到四个变体。
- 分离器：在下一行上添加`---`然后是空白行，然后是页面内容。
- 链接：使用绝对Wiki URL。在URL中将空格变为'+`+`
- 新页面：如果尚未进行翻译，则可以暂时保留EN页面；准备就绪时添加其他文件。

片段

- 将其放在每个页面的顶部，用Wiki文件名代替"页面标题”，而无需扩展：
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
- `---`

会议

- 色相节点页：部分应遵循\`\`germal''，\`\`\`映射'，'uptuffs'，\`
- 使用一致的dpt符号（例如，`dpt 3.007`，`dpt 5.001`，`dpt 9.001`）。
- 使产品名称和品牌保持不变（例如，色调，KNX）。

维护者

- 验证所有页面：\`npm运行wiki：validate'
- 绝对URL的自动固定语言条：\`npm运行Wiki：fix-langbar\`\`
- 注意：`_sidebar.md`，'\_footer.md\`，\`\`samples/'下的页面''被排除在验证之外。
