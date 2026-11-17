# Claude SessionKey 登录插件

一个轻量的 Chrome Manifest V3 扩展，通过手动导入自己的 SessionKey 恢复 Claude 会话。无需依赖或构建，所有扩展代码均在本地运行。

## 使用

1. 下载本仓库 ZIP 并解压，或运行 `git clone https://github.com/0xErnest/claude-session-login.git`。
2. 在 `chrome://extensions` 开启「开发者模式」，点击「加载已解压的扩展程序」，选择包含 `manifest.json` 的目录。
3. 点击插件图标，粘贴自己账号的 SessionKey 原始值。
4. 点击「写入并打开 Claude」，在新打开的页面确认账号与登录结果。已有 Claude 页面需刷新。

此操作会替换当前 Chrome 用户的 Claude 会话。若要保留原账号，请在另一个 Chrome 用户中安装使用。

## 行为与限制

- 只申请 `cookies` 和 `https://claude.ai/*` 权限。
- 写入 `.claude.ai`、路径 `/` 的 `sessionKey`，设置 Secure、HttpOnly、SameSite=Lax，作为会话 Cookie，不指定持久化过期时间。Chrome 的会话恢复设置可能使其在重启后仍存在。
- 输入默认遮挡，成功写入后清空。无后台脚本、日志、额外存储或密钥上传；Cookie 本身由 Chrome 保存并随 Claude 请求发送。
- 无痕使用需手动允许扩展在无痕模式运行；split 模式使用独立的 Cookie 上下文。
- 写入成功不等于服务端接受会话。过期、撤销、设备限制或额外验证不能通过本插件绕过，请正常登录。
- 本实现假设 Claude 使用 `sessionKey` Cookie；这不是官方登录 API，站点变更可能导致失效。
- 「清空输入」只清空弹窗；退出账号请使用 Claude 的退出登录功能。

API 参考：https://developer.chrome.com/docs/extensions/reference/api/cookies

## 开发

编辑 `popup.html`、`popup.css` 或 `popup.js` 后，在 Chrome 扩展管理页面点击重新加载。
可运行 `node --check popup.js` 检查 JavaScript 语法。真实登录效果需使用自己的有效会话在 Chrome 中验证。

本项目与 Anthropic 无关联，亦未获得其认可。

## 许可证

[MIT](LICENSE)
