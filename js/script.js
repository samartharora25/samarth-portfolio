import { initNavigation } from "./modules/navigation.js";
import { initCustomCursor } from "./modules/cursor.js";
import {
  initCopyEmail,
  isNotMobileDevice,
  initAge,
  updateGreeting,
} from "./modules/utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (isNotMobileDevice) initCustomCursor();
  await updateGreeting();
  initNavigation();
  initAge();
  initCopyEmail();
});
