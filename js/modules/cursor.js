let customCursorDiv, cursorTrailDiv, customCursor, cursorTrail;
let isTouching = false;
let isInsideCard = true;

// Toggle cursor Display
const setCursorDisplay = (visible) => {
  const Display = visible ? "block" : "none";
  customCursorDiv.style.display = Display;
  cursorTrailDiv.style.display = Display;
};

// Hide the cursor on touch or certain events
const hideCursor = () => {
  isTouching = true;
  setCursorDisplay(false);
};

// Show the cursor on mouse move
const handleMouseMove = (e) => {
  setCursorDisplay(true);

  if (isInsideCard && (e.target.closest(".card") || e.target.closest(".card-image"))) {
    isInsideCard = false;
    cursorTrail.textContent = "VIEW";
    updateCursorClasses("add", ["card-view"]);
  }

  const offset = customCursorDiv.offsetWidth / 2 || 41.5;
  const cursorX = e.clientX - offset;
  const cursorY = e.clientY - offset;
  customCursorDiv.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  setTimeout(() => {
    cursorTrailDiv.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  }, 70);
};

// Handle theme toggle and text updates
const handleThemeToggle = (isInsideLamp = false) => {
  cursorTrail.textContent = isInsideLamp
    ? document.documentElement.getAttribute("data-theme") === "dark"
      ? "LIGHT"
      : "DARK"
    : "";
};

// Update cursor classes
const updateCursorClasses = (action, classes) => {
  [customCursor, cursorTrail, customCursorDiv, cursorTrailDiv].forEach((el) =>
    el.classList[action](...classes)
  );
};

// Update cursor styles for specific elements
const handleMouseEnter = (e) => {
  const target = e.target;
  if (target.closest("#theme-toggle")) {
    handleThemeToggle(true);
    updateCursorClasses("add", ["lamp-view"]);
  } else if (target.closest(".sidebar-link, .cv-page a, .grid-item a") && !target.closest(".sidebar-link.active")) {
    updateCursorClasses("add", ["hovered"]);
  }
};

const handleMouseLeave = (e) => {
  const target = e.target;
  if (target.matches("#theme-toggle")) {
    handleThemeToggle(false);
    updateCursorClasses("remove", ["lamp-view"]);
  } else if (target.matches(".card")) {
    isInsideCard = true;
    cursorTrail.textContent = "";
    updateCursorClasses("remove", ["card-view"]);
  } else if (target.matches(".sidebar a, .cv-page a, .grid-item a")) {
    updateCursorClasses("remove", ["hovered"]);
  }
};

const handleMouseLeaveWindow = (e) => {
  if (e.relatedTarget === null) hideCursor();
};

// Attach listeners to specific elements
const initCustomCursorListeners = () => {
  const themeToggle = document.querySelector("#theme-toggle");
  const links = document.querySelectorAll(
    ".sidebar a, .cv-page a, .grid-item a"
  );

  // Add event listeners to each element
  if (themeToggle) {
    themeToggle.addEventListener("mouseenter", handleMouseEnter);
    themeToggle.addEventListener("mouseleave", handleMouseLeave);
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);
  });
};

const handleKeydown = (e) => {
  // Check for spacebar or arrow keys
  if (
    [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    hideCursor();
  }
};

// Initialize the custom cursor and listeners
const initCustomCursor = () => {
  customCursorDiv = document.createElement("div");
  customCursorDiv.className = "custom-cursor-div";

  cursorTrailDiv = document.createElement("div");
  cursorTrailDiv.className = "cursor-trail-div";

  customCursor = document.createElement("div");
  customCursor.className = "custom-cursor";

  cursorTrail = document.createElement("div");
  cursorTrail.className = "cursor-trail";

  customCursorDiv.appendChild(customCursor);
  cursorTrailDiv.appendChild(cursorTrail);

  document.body.insertBefore(cursorTrailDiv, document.body.firstChild);
  document.body.insertBefore(customCursorDiv, document.body.firstChild);

  document.body.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeaveWindow, true);

  document.body.addEventListener("touchstart", hideCursor);
  window.addEventListener("keydown", handleKeydown);

  // Attach listeners to specific elements
  initCustomCursorListeners();
};

const resetCursorStyle = () => {
  isInsideCard = true;
  cursorTrail.textContent = "";
  updateCursorClasses("remove", ["card-view", "lamp-view", "hovered"]);
};

export {
  initCustomCursor,
  resetCursorStyle,
  handleMouseEnter,
  handleMouseLeave,
};
