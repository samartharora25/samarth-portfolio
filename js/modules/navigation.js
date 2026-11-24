import {
  isMobileDevice,
  isNotMobileDevice,
  loadProjects,
  toggleTheme,
  isInScrollableContainer,
  updateProgressBar,
  isAtScrollableExtremes,
  vibrateOnMobile,
  clearSelection,
} from "./utils.js?v=2";

import { resetCursorStyle } from "./cursor.js";

const rootStyles = getComputedStyle(document.documentElement);
const animationDuration = parseInt(
  rootStyles.getPropertyValue("--animation-duration")
);

const links = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll(".section");
const visualOrder = ["home", "bio", "projects", "cv", "connect"];
let currentSectionIndex = 0;

let isScrolling = false;
const scrollActivationThreshold = 52;

let projectsLoaded = false;

let touchStartY = 0; // Track initial touch position
let touchEndY = 0; // Track final touch position

// Update the link colors and icons based on the active section
function updateLinkColorsAndIcons(index) {
  links.forEach((link, linkIndex) => {
    const icon = link.querySelector(".sidebar-icon");
    const isActive = linkIndex === index;
    link.classList.toggle("active", isActive);
    icon.classList.toggle(
      "exiting",
      !isActive && linkIndex === currentSectionIndex
    );
  });
}

// Show the section at the specified index
function showSection(index, direction) {
  if (isNotMobileDevice) resetCursorStyle();
  updateLinkColorsAndIcons(index);

  const currentSection = sections[currentSectionIndex];
  const nextSection = sections[index];

  // Load projects only once when the "projects" section is shown
  if (!projectsLoaded && nextSection.id === "projects") {
    loadProjects();
    projectsLoaded = true; // Ensure this runs only once
  }

  sections.forEach((section) =>
    section.classList.remove("push-up", "push-down", "enter-up", "enter-down")
  );
  nextSection.classList.add(
    "active",
    direction === "down" ? "enter-up" : "enter-down"
  );
  currentSection.classList.add(direction === "down" ? "push-up" : "push-down");

  // Reset progress bar and scroll position in the next section
  const nextProgressBar = nextSection.querySelector(".progress-bar");
  if (nextProgressBar) nextProgressBar.style.width = "0%";

  const nextDescriptionContainer = nextSection.querySelector(
    ".description-container"
  );
  if (nextDescriptionContainer) {
    nextDescriptionContainer.scrollTop = 0;
  }
  clearSelection();

  // Transition cleanup after animation ends
  setTimeout(() => {
    currentSection.classList.remove("active", "push-up", "push-down");
    nextSection.classList.remove("enter-up", "enter-down");
    currentSectionIndex = index;
    isScrolling = false;
  }, animationDuration);
}

// Handle sidebar navigation
function handleSideBarNavigation(event) {
  if (isScrolling) return;

  event.preventDefault();
  const targetSectionId = event.target.getAttribute("href").substring(1);
  const targetIndex = visualOrder.indexOf(targetSectionId);
  const direction = targetIndex > currentSectionIndex ? "down" : "up";

  if (targetIndex !== currentSectionIndex) {
    isScrolling = true;
    vibrateOnMobile();
    showSection(targetIndex, direction);
  }
}

// Handle the navigation based on direction
function handleNavigation(direction) {
  if (isScrolling) return;
  isScrolling = true;

  const nextIndex =
    direction === "down"
      ? (currentSectionIndex + 1) % sections.length
      : (currentSectionIndex - 1 + sections.length) % sections.length;

  showSection(nextIndex, direction);
}

// Handle the scroll event to navigate through sections
function handleScroll(event) {
  if (isScrolling) return;

  // checking if the container is scrollable, if yes setting navigation trigger at extemes
  const container = isInScrollableContainer(event);
  if (container && !isAtScrollableExtremes(container)) return;

  const dy = event.deltaY;
  const direction = dy > 0 ? "down" : "up";
  if (Math.abs(dy) > scrollActivationThreshold) {
    handleNavigation(direction);
  }
}

function handleKeyDown(event) {
  if (isScrolling || isInScrollableContainer(event)) return;

  const direction = ["ArrowDown", "ArrowRight", " "].includes(event.key)
    ? "down"
    : "up";
  if (
    ["ArrowDown", "ArrowRight", " ", "ArrowUp", "ArrowLeft"].includes(event.key)
  ) {
    handleNavigation(direction);
  }
}

// Handle touch events for navigation
function handleTouchStart(event) {
  if (isScrolling) return;

  if (isInScrollableContainer(event)) {
    const container = event.target.closest(".description-container");
    if (!isAtScrollableExtremes(container)) return;
  }
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  if (isScrolling) return;

  if (isInScrollableContainer(event)) {
    const container = event.target.closest(".description-container");
    if (!isAtScrollableExtremes(container)) return;
  }

  touchEndY = event.changedTouches[0].clientY;
  const dy = touchStartY - touchEndY;
  if (Math.abs(dy) > scrollActivationThreshold * 3) {
    const direction = dy > 0 ? "down" : "up";
    handleNavigation(direction);
  }
}

// Initialize navigation functionality
function initNavigation() {
  document
    .getElementById("theme-toggle")
    .addEventListener("click", toggleTheme);

  if (isMobileDevice) {
    document.querySelectorAll("a").forEach((e) => {
      e.addEventListener("click", vibrateOnMobile);
    });
  }

  updateLinkColorsAndIcons(currentSectionIndex);
  window.addEventListener("wheel", handleScroll);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);

  // Update progress bars during scrolling
  document.querySelectorAll(".description-container").forEach((container) => {
    container.addEventListener("scroll", () => updateProgressBar(container));
  });

  // Add click navigation for sidebar links
  links.forEach((link) => {
    link.addEventListener("click", handleSideBarNavigation);
  });
}

export { initNavigation };
