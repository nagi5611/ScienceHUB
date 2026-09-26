/** Shows access denied and hides hub-header on 403. */
export function showHubAppAccessDenied(deniedId = "access-denied") {
  const denied = document.getElementById(deniedId);
  if (denied) denied.hidden = false;
  document.querySelector(".hub-header")?.setAttribute("hidden", "");
}
