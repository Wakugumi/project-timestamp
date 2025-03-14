exports.PQueue = class {
  constructor(max = 1) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }
};
