import system from "./system-driver";

export default class PrinterDriver {
  #split: boolean;

  #command: string;

  constructor(filepath: string, quantity: number, split: boolean) {
    this.#split = split;
    let files = "";
    for (let i = 0; i < quantity; i++) files += filepath + " ";
    this.#command = `lp -d PRINTER ${files} -o ${this.#split ? "PageSize=w288h432-div2" : "PageSize=w288h432"} -o StpLaminate=Matte`;
  }

  /** Send current instance configuration as a job to the printer */
  public sendJob() {
    try {
      system.execute("bash", ["-c", this.#command]);
    } catch (error) {
      throw error;
    }
  }
}
