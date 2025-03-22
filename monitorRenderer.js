// electron/monitorRenderer.js
window.electron.onStateUpdate((state) => {
  document.getElementById("state-display").innerText = JSON.stringify(
    state,
    null,
    2,
  );
});
