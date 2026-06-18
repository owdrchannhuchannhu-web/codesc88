window.formatNumberVi = function formatNumberVi(value) {
  return new Intl.NumberFormat("vi-VN").format(value);
};

window.getNowString = function getNowString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
};

window.maskUsername = function maskUsername(username) {
  const value = String(username).trim();
  if (value.length <= 5) return `${value}*****`;
  return `${value.slice(0, 7)}*****`;
};

window.randomPoints = function randomPoints() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};

window.randomTxCode = function randomTxCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TX";

  for (let i = 0; i < 10; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

window.escapeHtml = function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};
