/**
 * 设备检测工具 — 判断 PC / Android / iOS
 *
 * 服务端：从 User-Agent header 解析
 * 客户端：从 navigator.userAgent 或 <html> data 属性读取（由 layout 注入）
 */

export interface DeviceInfo {
  os: "windows" | "macos" | "linux" | "android" | "ios" | "unknown";
  type: "pc" | "mobile";
  browser: string;
}

/** 服务端：解析 User-Agent 字符串 */
export function parseUA(ua: string): DeviceInfo {
  const lower = (ua || "").toLowerCase();

  // ── OS ──
  let os: DeviceInfo["os"] = "unknown";
  if (lower.includes("android")) os = "android";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "ios";
  else if (lower.includes("windows")) os = "windows";
  else if (lower.includes("mac os") || lower.includes("macintosh")) os = "macos";
  else if (lower.includes("linux")) os = "linux";

  // ── 设备类型 ──
  const isMobile = os === "android" || os === "ios";
  const type: DeviceInfo["type"] = isMobile ? "mobile" : "pc";

  // ── 浏览器 ──
  let browser = "unknown";
  if (lower.includes("edg/") || lower.includes("edge/")) browser = "edge";
  else if (lower.includes("chrome/")) browser = "chrome";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "safari";
  else if (lower.includes("firefox/")) browser = "firefox";
  else if (lower.includes("opera") || lower.includes("opr/")) browser = "opera";

  return { os, type, browser };
}

/** 客户端 React Hook — 从 <html> data 属性读取设备信息 */
export function getClientDevice(): DeviceInfo {
  if (typeof document === "undefined") {
    return { os: "unknown", type: "pc", browser: "unknown" };
  }
  const html = document.documentElement;
  return {
    os: (html.dataset.os as DeviceInfo["os"]) || "unknown",
    type: (html.dataset.device as DeviceInfo["type"]) || "pc",
    browser: html.dataset.browser || "unknown",
  };
}

/** 简化判断 */
export function isMobile(ua?: string): boolean {
  if (ua) return parseUA(ua).type === "mobile";
  if (typeof navigator !== "undefined") {
    return /android|iphone|ipad/i.test(navigator.userAgent);
  }
  return false;
}

export function isAndroid(ua?: string): boolean {
  if (ua) return parseUA(ua).os === "android";
  if (typeof navigator !== "undefined") {
    return /android/i.test(navigator.userAgent);
  }
  return false;
}
