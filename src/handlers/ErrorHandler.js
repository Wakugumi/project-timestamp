const { WebContents } = require("electron/main");
const { logger } = require("../utility/logger");
const state = require("../helpers/StateManager.js");
const StateManager = require("../helpers/StateManager.js");

/**
 * @define rendererErrorData
 * @param {phase} number - last phase of the current session

/**
 *
 * @param {WebContents} content
 * @param {import("electron/utility").IpcMainInvokeEvent} event
 *
 */
exports.rendererErrorHandler = async (content, event, data) => {
  logger.error(
    `Renderer error, attempting to reload the app (last phase: ${data.phase})`,
  );
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    content.forcefullyCrashRenderer();
    content.reloadIgnoringCache();
    state.set("reboot", "error");
  }
};
