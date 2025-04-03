import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";
import { ProcessQueue } from "./process-queue";

export default class SystemDriver {
  static queue: ProcessQueue = new ProcessQueue();

  public static execute(
    command: string,
    args: string[],
    handleOutput?: (stdout: any, stderr: any) => void,
  ) {
    return this.queue.add(
      () =>
        new Promise((resolve, reject) => {
          const process: ChildProcessWithoutNullStreams = spawn(command, args);

          let stdout = "";
          let stderr = "";

          process.stdout.on("data", (data) => {
            stdout += data;
            handleOutput?.(stdout, stderr);
          });

          process.on("close", (code) => {
            if (code === 0) resolve(stdout.trim());
            else
              reject(
                new Error(
                  `Process execution failed (code ${code}): ${stderr.trim()}`,
                ),
              );
          });

          process.on("error", (err) => {
            reject(new Error(`Failed to execute rpocess: ${err.message}`));
          });

          this.queue.trackProcess(process.pid, () => process.kill());
        }),
    );
  }

  /**
   * Allow killing the current running process
   */
  public static forceStop() {
    this.queue.killCurrent();
  }
}
