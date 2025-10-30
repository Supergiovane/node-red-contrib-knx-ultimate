🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Home) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Home) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Home) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Home) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Home) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)

<!-- NAV START -->
导航: [首页](/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)  
概览: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [常见问题](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot) • [安全](/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY) • [文档：语言栏](/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)  
KNX 设备: [网关](/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration) • [设备](/node-red-contrib-knx-ultimate/wiki/zh-CN-Device) • [节点保护](/node-red-contrib-knx-ultimate/wiki/zh-CN-Protections)  
其他 KNX 节点: [场景控制器](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration) • [看门狗](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration) • [日志节点](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration) • [全局上下文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable) • [告警器](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration) • [负载控制](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration) • [查看器](/node-red-contrib-knx-ultimate/wiki/zh-CN-knxUltimateViewer) • [自动响应](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder) • [HA 翻译器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator) • [物联网桥接](/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Bridge+configuration) • [灯](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light) • [电池](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Battery) • [按钮](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Button) • [接触](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Contact+sensor) • [设备软件更新](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Device+software+update) • [光照传感器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light+sensor) • [运动](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Motion) • [场景](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Tapdial) • [温度](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Temperature+sensor) • [Zigbee 连接](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Zigbee+connectivity)  
示例: [日志](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/zh-CN-Manage-Wiki)
<!-- NAV END -->

---

# KNX Ultimate 节点专业概览

## knxUltimate-config
**作用**：统一配置 KNX/IP 网关参数，供所有 KNX 节点复用。
**核心功能**：支持 Tunnelling/KNX Secure，导入 ETS CSV 自动补全，提供连接诊断与总线监视。
**配置步骤**：填写网关地址与端口，选择网卡，导入 ETS 文件并按需启用 Secure 或监视选项。

## hue-config
**作用**：管理 Philips Hue Bridge 的认证信息并共享给所有 Hue 节点。
**核心功能**：引导式配对、持久化 Token、EventStream 推送、REST 轮询备用、TLS/时钟校验。
**配置步骤**：按下 Bridge 的 link 键，运行配对向导，选择 EventStream 或轮询模式并保存配置实例。

## knxUltimate
**作用**：在 Node-RED 中收发 KNX 电报并自动处理 DPT 转换。
**核心功能**：GA 自动补全、ETS 过滤、优先级处理、运行统计、可选 Node Pins。
**配置步骤**：选择网关，设定正确的 DPT，配置 ACK/重发策略，并按流程需要启用 Pins 或过滤器。

## knxUltimateLogger
**作用**：记录 KNX 电报与数值用于审计、调试或导出。
**核心功能**：循环缓冲、GA/DPT 过滤、CSV/JSON 导出、全局上下文集成。
**配置步骤**：指定输出目录，设置保留策略与阈值，开启需要的通知或外部同步。

## knxUltimateViewer
**作用**：提供 HTML/JSON 仪表板实时查看 KNX 数据。
**核心功能**：实时表格、卡片视图、JSON 输出、队列分析。
**配置步骤**：挑选要展示的 GA，自定义标签与刷新频率，并启用期望的视图。

## knxUltimateAlerter
**作用**：在 KNX 数值触发阈值或规则时发出告警。
**核心功能**：多重比较、滞回、自动复位、输出到邮件/MQTT/日志。
**配置步骤**：设定判定条件与消息内容，将输出连接到所需的报警渠道。

## knxUltimateAutoResponder
**作用**：自动回应 KNX 读取请求，返回最新缓存值。
**核心功能**：值缓存、多 GA 映射、外部写入、活动日志。
**配置步骤**：配置监听与响应 GA，设定缓存有效期，并接入必要的外部更新输入。

## knxUltimateGlobalContext
**作用**：将 KNX 数据同步到 Node-RED 全局上下文，便于跨流程使用。
**核心功能**：GA→Context 绑定、可选双向同步、DPT 过滤。
**配置步骤**：确定上下文键名，选择同步方向，并为外部来源配置 Node Pins。

## knxUltimateHATranslator
**作用**：把 KNX 电报转换成 Home Assistant 负载并支持反向转换。
**核心功能**：DPT→实体映射、发现助手、布尔/数值归一化、可选确认。
**配置步骤**：定义目标实体与模板，设置转换规则，并按需连接反馈 Pins。

## knxUltimateLoadControl
**作用**：根据总负载策略动态切断或恢复非关键 KNX 负载。
**核心功能**：负载分组、优先级调度、分段卸载/恢复、事件缓冲。
**配置步骤**：映射功率测量 GA，给负载分配优先级，设置切断与恢复的延迟时间。

## knxUltimateSceneController
**作用**：执行带条件的多步骤 KNX 场景并允许人工干预。
**核心功能**：步骤编排、条件触发、场景记忆、手动覆盖。
**配置步骤**：列出目标场景，配置延时与条件，并通过 Node Pins 连接触发输入。

## knxUltimateWatchDog
**作用**：监测网关或关键 GA 的心跳并在超时后告警。
**核心功能**：周期 Ping、延迟统计、自动恢复动作、健康度指标。
**配置步骤**：设定监测列表与超时阈值，将输出连接到日志或告警流程。

## knxUltimateHueBattery
**作用**：在 KNX 中展示 Hue 无线设备的电量状态。
**核心功能**：device_power→DPT 5.001 转换、开机读取、阈值告警、Node Pins。
**配置步骤**：配置百分比 GA，定义提醒阈值，并决定是否推送到面板或日志。

## knxUltimateHueButton
**作用**：将 Hue 按钮事件映射到 KNX 电报。
**核心功能**：短按/长按识别、多资源支持、DPT 1.xxx/18.xxx 映射、去抖处理。
**配置步骤**：选择 Hue 资源，为每个事件分配 GA，并调整去抖与反馈选项。

## knxUltimateHueCameraMotion
**作用**：把 Hue Secure 摄像头的动作事件同步到 KNX。
**核心功能**：实时 EventStream、布尔映射、假警过滤、初始缓冲。
**配置步骤**：挑选摄像头，设置目标 GA 与 DPT，并连接到安防或照明流程。

## knxUltimateHueContactSensor
**作用**：同步 Hue 磁簧门磁（开/关）到 KNX 地址。
**核心功能**：`contact` 资源过滤、DPT 1.019 映射、逻辑反转可选、ETS 标签。
**配置步骤**：选择传感器，配置状态/告警 GA，并设定提醒或延时策略。

## knxUltimateHueHumiditySensor
**作用**：向 KNX 发送 Hue 传感器的相对湿度值。
**核心功能**：换算至 DPT 9.007、可选平滑、启动读取、Node Pins。
**配置步骤**：设置湿度 GA，按需添加滤波或阈值并把输出接入控制逻辑。

## knxUltimateHueLight
**作用**：通过 KNX 控制 Hue 灯具的开关、调光、颜色与场景。
**核心功能**：多 GA 映射、昼夜模式、状态反馈、Node Pins。
**配置步骤**：分配开关/状态/调光/颜色 GA，配置渐变和场景模式，并在 Bridge 上启用 EventStream。

## KNX Monitor 侧边栏
**作用**：在 Node-RED 右侧的侧边栏（标签区域）实时查看 KNX 数据包。
**核心功能**：1 秒刷新、新电报高亮、布尔快速开关、可选排序。
**配置步骤**：选择 KNX 网关，按需启用自动刷新或排序，并设置感兴趣的 GA 过滤。

## KNX Debug 侧边栏
**作用**：无需打开服务器控制台，就能在侧边栏实时查看全部 KNX 日志行。
**核心功能**：5 000 行滚动缓冲、按严重级别着色、自动/手动刷新、单击复制到剪贴板。
**配置步骤**：打开该标签，保持自动刷新开启（或需要时点击“刷新”），使用复制图标导出当前日志快照。

## knxUltimateHueLightSensor
**作用**：把 Hue 光照度数值注入 KNX 总线。
**核心功能**：自动转换 DPT 9.004、可选平滑、启动读取。
**配置步骤**：指定光照 GA，设置过滤/偏移，并决定是否暴露 Node Pins。

## knxUltimateHueMotion
**作用**：整合 Hue 动作传感器到 KNX 场景中。
**核心功能**：布尔输出、DPT 过滤、超时控制、Pins 可见性配置。
**配置步骤**：配置动作与状态 GA，设定超时，并在 Behaviour 标签管理 Pins。

## knxUltimateHuePlug
**作用**：通过 KNX 控制 Hue 智能插座并获取状态/功率信息。
**核心功能**：开关控制、状态与功率通道、供电可用性、Node Pins。
**配置步骤**：映射控制/状态/功率 GA，选择合适 DPT，并启用启动时读取。

## knxUltimateHueScene
**作用**：用 KNX 事件触发单场景或多场景的 Hue 自动化。
**核心功能**：支持 DPT 1.xxx/18.xxx、多场景规则、可选状态反馈。
**配置步骤**：挑选目标场景，配置触发与状态 GA，并根据需要设置高级映射。

## knxUltimateHueTapDial
**作用**：把 Hue Tap Dial 作为 KNX 的旋钮或场景选择器。
**核心功能**：增减步进、DPT 3.007/5.001/自定义、可选反馈。
**配置步骤**：绑定 Hue 设备，设定目标 GA 与灵敏度，并开启需要的 Pins。

## knxUltimateHueTemperatureSensor
**作用**：将 Hue 温度数据以 DPT 9.001 形式发送到 KNX。
**核心功能**：初始同步、温度偏移、Node Pins。
**配置步骤**：设置温度 GA，定义校正值，并暴露必要的输出。

## knxUltimateHueZigbeeConnectivity
**作用**：在 KNX 中提示 Hue 设备的 Zigbee 在线状态。
**核心功能**：布尔映射、启动读取、失联策略。
**配置步骤**：指定布尔 GA 与 DPT，规划掉线时的处理并接入告警频道。

## knxUltimateHuedevice_software_update
**作用**：通知 KNX 系统 Hue 固件更新的可用状态。
**核心功能**：解析 `up_to_date/available/required` 状态、事件记录、计划提醒。
**配置步骤**：配置告警 GA，设定通知策略，并接入仪表板或运维系统。

## knxUltimateLoadControl（Hue 友好集成）
**作用**：结合 Hue 传感器的测量结果执行 KNX 负载削减策略。
**核心功能**：阈值判定、优先级关断、恢复节奏与告警联动。
**配置步骤**：引用前述负载控制配置，额外映射 Hue 采集 GA，并定义何时触发削减。

## knxUltimateLogger（Hue + KNX）
**作用**：统一记录 KNX 与 Hue 事件形成混合审计。
**核心功能**：多源合并、事件标签、导出存档、告警关联。
**配置步骤**：在 Logger 中添加 Hue 数据源，设置标签或过滤条件，并安排导出或告警流程。

## knxUltimateViewer（Hue + KNX）
**作用**：构建同时展示 KNX 与 Hue 数据的示例仪表板。
**核心功能**：多数据集视图、实时刷新、演示友好布局。
**配置步骤**：在 Viewer 中选择两个系统的关键 GA，配置显示模板，并针对演示场景调整刷新频率。
