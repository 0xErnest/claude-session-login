"use strict";

const key = document.getElementById("key");
const toggle = document.getElementById("toggle");
const clear = document.getElementById("clear");
const login = document.getElementById("login");
const status = document.getElementById("status");
const url = "https://claude.ai/";

function message(text, error = false) {
  status.textContent = text;
  status.dataset.error = String(error);
}

function clearInput() {
  key.value = "";
  key.type = "password";
  toggle.textContent = "显示";
  toggle.setAttribute("aria-pressed", "false");
}

toggle.addEventListener("click", () => {
  const visible = key.type === "password";
  key.type = visible ? "text" : "password";
  toggle.textContent = visible ? "隐藏" : "显示";
  toggle.setAttribute("aria-pressed", String(visible));
});

clear.addEventListener("click", () => {
  clearInput();
  message("已清空输入，现有登录 Cookie 未改变。");
});

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (login.disabled) return;
  const value = key.value.trim();
  // Accept opaque cookie values without assuming an undocumented token prefix.
  if (!value || !/^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/.test(value) || value.startsWith("sessionKey=")) {
    message("请输入完整的 SessionKey 值，不含空格、引号或 sessionKey= 前缀。", true);
    return;
  }
  for (const control of [key, toggle, clear, login]) control.disabled = true;
  message("正在写入会话 Cookie…");
  try {
    const cookie = await chrome.cookies.set({
      url,
      name: "sessionKey",
      value,
      domain: ".claude.ai",
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    });
    if (!cookie || cookie.value !== value) throw new Error("Write failed");
    clearInput();
    message("Cookie 已写入。请在 Claude 页面确认登录结果。");
    try {
      await chrome.tabs.create({ url });
    } catch {
      message("Cookie 已写入，但页面未打开。请点击下方链接打开 Claude。", true);
    }
  } catch {
    message("写入失败。请检查扩展对 claude.ai 的访问权限后重试。", true);
  } finally {
    for (const control of [key, toggle, clear, login]) control.disabled = false;
  }
});
