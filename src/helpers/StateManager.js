const { logger } = require("../utility/logger.js");
class StateManager {
  constructor() {
    if (!StateManager.instance) {
      this.state = {};
      StateManager.instance = this;
    }
    return StateManager.instance;
  }

  set(key, value) {
    this.state[key] = value;
  }

  get(key) {
    return this.state[key];
  }

  reset() {
    this.state = {}; // Clears state when needed
  }
}

module.exports = new StateManager();
