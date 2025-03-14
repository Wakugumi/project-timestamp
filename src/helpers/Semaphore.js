/**
 * Semaphore technique implementation for mutual exclusive process
 * Use this for handling asynchronous processes
 */
exports.Semaphore = class {
  constructor(max = 1) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }

  /**
   * New slot to the queue
   */
  acquire() {
    return new Promise((resolve) => {
      if (this.count < this.max) {
        this.count++;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.count--;
    }
  }
};
