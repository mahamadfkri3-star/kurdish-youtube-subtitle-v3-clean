console.log("[KYS V3] content script loaded");

let lastCaption = "";

function normalizeText(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getYouTubeCaption() {
  const segments = [...document.querySelectorAll(".ytp-caption-segment")];

  const text = segments
    .filter((element) => {
      const style = getComputedStyle(element);

      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || 1) > 0
      );
    })
    .map((element) => normalizeText(element.textContent))
    .filter(Boolean)
    .join(" ");

  return normalizeText(text);
}

function getPlayer() {
  return document.querySelector("#movie_player");
}

function ensureOverlay() {
  const player = getPlayer();

  if (!player) {
    return null;
  }

  let overlay = document.getElementById("kys-v3-overlay");

  if (overlay && overlay.parentElement === player) {
    return overlay;
  }

  overlay?.remove();

  overlay = document.createElement("div");
  overlay.id = "kys-v3-overlay";

  Object.assign(overlay.style, {
    position: "absolute",
    left: "50%",
    bottom: "12%",
    transform: "translateX(-50%)",
    zIndex: "999999",
    maxWidth: "80%",
    background: "rgba(0, 0, 0, 0.75)",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "28px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    lineHeight: "1.5",
    pointerEvents: "none"
  });

  player.appendChild(overlay);

  return overlay;
}

function checkCaption() {
  const caption = getYouTubeCaption();
  const overlay = ensureOverlay();

  if (!overlay) {
    return;
  }

  if (!caption) {
    overlay.textContent = "";
    overlay.style.display = "none";
    lastCaption = "";
    return;
  }

  if (caption === lastCaption) {
    return;
  }

  lastCaption = caption;

  console.log("[KYS V3 CC]", caption);

  overlay.textContent = caption;
  overlay.style.display = "block";
}

setInterval(checkCaption, 100);