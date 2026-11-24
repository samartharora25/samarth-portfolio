import { initNavigation } from "./modules/navigation.js";
import { initCustomCursor } from "./modules/cursor.js";
import {
  initCopyEmail,
  isNotMobileDevice,
  updateGreeting,
} from "./modules/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (isNotMobileDevice) initCustomCursor();
  updateGreeting();
  initNavigation();
  initCopyEmail();
});
