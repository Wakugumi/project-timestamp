import { ProcessQueue } from "../process-queue";

describe("ProcessQueue with process tracking", () => {
  let queue = new ProcessQueue();

  it("should track the current running process", async () => {
    let killed = false;

    const fakeProcess = {
      pid: 1234,
      kill: () => (killed = true),
    };

    queue.trackProcess(fakeProcess.pid, fakeProcess.kill);
    expect(queue.isRunning()).toBe(false);
    queue.killCurrent();
    expect(killed).toBe(true);
  });

  it("should kill long-running processes", async () => {
    let wasKilled = false;

    const longTask = () =>
      new Promise((resolve) => {
        queue.trackProcess(5678, () => {
          wasKilled = true;
          resolve(undefined);
        });
        setTimeout(resolve, 10000); // Simulate long process
      });

    const taskPromise = queue.add(longTask);

    queue.killCurrent(); // Kill it mid-way
    await expect(taskPromise).resolves.toBeUndefined();
    expect(wasKilled).toBe(true);
  });
});
