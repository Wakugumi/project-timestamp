type TaskFunction<T> = () => Promise<T>;

export class ProcessQueue {
  private queue: TaskFunction<any>[] = [];
  private running = false;
  private currentProcess: null | { pid: number; kill: () => void } = null;

  /**
   * Add a task to the queue and resolve in order
   * @param task - Async function returning promise
   * @returns Promise resolving to the task's result
   */
  public add<T>(task: TaskFunction<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task());
        } catch (err) {
          reject(err);
        } finally {
          this.next();
        }
      });

      if (!this.running) this.next();
    });
  }

  /**
   * Executes the next task in the queue
   */
  private async next() {
    if (this.running || this.queue.length === 0) {
      this.running = false;
      return;
    }

    this.running = true;
    const nextTask = this.queue.shift();

    if (nextTask) {
      try {
        await nextTask();
      } finally {
        this.running = false;
        this.currentProcess = null;
        this.next();
      }
    }
  }

  trackProcess(pid: number, kill: () => void) {
    this.currentProcess = { pid, kill };
  }

  killCurrent() {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }

  /**
   * Check if a task is currently running
   */
  public isRunning(): boolean {
    return this.running;
  }

  /** clear the queue (resets)
   */
  public clear(): void {
    this.queue = [];
    this.running = false;
  }
}
