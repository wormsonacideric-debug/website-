/* Game-specific logic belongs here. Keep this file independent of the main WOA page. */
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  if (status) status.textContent = "READY";
});