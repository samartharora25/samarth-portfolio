import { handleMouseLeave } from "./cursor.js";

const email = "samarth.arora7official@gmail.com";
const isMobileDevice =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isNotMobileDevice = !isMobileDevice;

const copyButton = document.querySelector(".copy");
const copyIcon = document.querySelector(".copy-icon");


const updateGreeting = () => {
  document.querySelector(".greeting-greet").textContent = "Hello, I am";
  document.querySelector(".loading-screen").remove();
  const mainContainer = document.querySelector(".main-container");
  mainContainer.style.visibility = "visible";
  mainContainer.style.opacity = 1;
};

function vibrateOnMobile(t = [20]) {
  if (isMobileDevice) {
    navigator.vibrate(t);
  }
}

function toggleTheme() {
  vibrateOnMobile([10]);

  const theme = document.documentElement.getAttribute("data-theme");
  const newTheme = theme === "dark" ? "light" : "dark";
  const toggleRays = document.getElementById("theme-toggle-rays");
  const scrollPrompt = document.getElementById("scroll-prompt");

  // Update theme-related styles
  document.documentElement.setAttribute("data-theme", newTheme);
  toggleRays?.classList.toggle("off", newTheme === "dark");
  scrollPrompt?.style.setProperty(
    "filter",
    newTheme === "dark" ? "invert(100%)" : "none"
  );

  // Update cursor trail content for non-mobile devices
  if (isNotMobileDevice) {
    document.querySelector(".cursor-trail.lamp-view").textContent =
      theme?.toUpperCase() || "";
  }
}

function updateProgressBar(container) {
  const winScroll = container.scrollTop;
  const height = container.scrollHeight - container.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = container.parentElement.querySelector(".progress-bar");
  progressBar.style.width = (scrolled > 100 ? 100 : scrolled) + "%";
}

function isScrollable(container) {
  return container.scrollHeight > container.clientHeight;
}

function isInScrollableContainer(event) {
  const container = event.target.closest(".description-container");
  if (container && isScrollable(container)) {
    return container; // Return the container if it's scrollable
  }
  return null; // Return null if not in a scrollable container
}

function isAtScrollableExtremes(container) {
  const winScroll = container.scrollTop;
  const height = container.scrollHeight - container.clientHeight;
  // // Debug
  // console.log("winR: "+winScroll);
  // console.log("win: "+Math.ceil(winScroll));
  // console.log("h: "+height);
  // console.log(winScroll===0 || Math.ceil(winScroll)+1 >= height);
  // // Added 1 to adjust computing error
  return winScroll === 0 || Math.ceil(winScroll) + 1 >= height;
}

function copyEmail() {
  copyButton.removeEventListener("click", copyEmail);
  navigator.clipboard.writeText(email).then(() => {
    copyIcon.classList.add("scale-down");
    setTimeout(() => {
      copyIcon.classList.add("copied");
      copyIcon.classList.remove("scale-down");
    }, 100);
    setTimeout(() => {
      copyIcon.classList.add("scale-down");
    }, 1500);
    setTimeout(() => {
      copyIcon.classList.remove("copied");
      copyIcon.classList.remove("scale-down");
      copyIcon.classList.add("scale-up");
    }, 1600);
    setTimeout(() => {
      copyIcon.classList.remove("scale-up");
      copyButton.addEventListener("click", copyEmail);
    }, 1700);
  });
}

function initCopyEmail() {
  copyButton.addEventListener("click", copyEmail);
}

function loadProjects() {
  fetch("data/projects.json") // Fetch JSON file from data folder
    .then((response) => response.json())
    .then((data) => populateProjects(data))
    .catch((error) => console.error("Error loading projects:", error));
}

function populateProjects(data) {
  const projectsContainer = document.getElementById("projects-container");
  if (!projectsContainer) {
    console.error("Projects container not found in DOM.");
    return;
  }

  data.forEach(({ imageUrl, title, description, link }) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-image-container">
        <img class="card-image" src="${imageUrl}" alt="${title}">
      </div>
      <h3>${title}</h3>
      <p>${description}</p>
    `;

    card.addEventListener("mousedown", (e) => {
      e.preventDefault();
      card.classList.add("clicked");
    });

    card.addEventListener("mouseup", (e) => {
      e.preventDefault();
      setTimeout(() => {
        vibrateOnMobile([5, 10, 20, 0]);
        card.classList.remove("clicked");
      }, 200);
      setTimeout(() => {
        window.open(link, "_blank");
      }, 400);
    });

    if (isNotMobileDevice) {
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    projectsContainer.appendChild(card);
  });
}

function clearSelection()
{
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}

export {
  isMobileDevice,
  isNotMobileDevice,
  updateGreeting,
  toggleTheme,
  isInScrollableContainer,
  updateProgressBar,
  isAtScrollableExtremes,
  isScrollable,
  initCopyEmail,
  vibrateOnMobile,
  loadProjects,
  clearSelection,
};
