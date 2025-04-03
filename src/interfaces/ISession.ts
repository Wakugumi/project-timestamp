import Frame from "./IFrame";
import Payment from "./IPayment";

export default interface ISession {
  /**
   * number indicator of session's stage
   */
  phase: number;

  /**
   * payment state of the current session, null if no payment has been made
   */
  payment: Payment | null;

  /**
   * user's selected frame in the current session, null if no frame has been selected
   */
  frame: Frame | null;

  /**
   * serialized object of canvas, generated from renderer session
   */
  canvas: JSON | null;

  /**
   * number of prints user choose
   */
  quantity: number;

  /**
   * number of reload of current session
   */
  reload: number;
}
