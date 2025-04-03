import axios from "axios";
import { ipcRenderer } from "electron";
import IFrame from "../interfaces/IFrame";
import IPayment from "../interfaces/IPayment";
import { store } from "../utilities/store-utility";

export default class SessionService {
  static #api = axios.create();
  /**
   * initiate begin procedure on current session
   * @returns {Promise<object>} object of fresh session state data
   */
  public static async begin() {
    try {
      await store.lazyInit();
      return await store.getState();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set current session to proceed next phase
   */
  public static async proceed() {
    try {
      await store.phaseIncrement();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch current session state data
   * @returns {Promise<ISession>} returns promise with object of current session's state
   */
  public static async load() {
    try {
      return await store.getState();
    } catch (error) {
      throw error;
    }
  }

  /**
   * End current session, resetting state data to default state
   */
  public static async end() {
    try {
      await store.reset();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set payment callback to session state
   */
  public static async payment(payment: IPayment) {
    try {
      await store.set("payment", payment);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set user selected frame to session state
   */
  public static async setFrame(frame: IFrame) {
    try {
      await store.set("frame", frame);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set renderer canvas to session state
   */
  public static async setCanvas(canvas: JSON) {
    try {
      await store.set("canvas", canvas);
    } catch (error) {
      throw error;
    }
  }

  public static async throw() {
    store.reloadIncrement();
    const count = await store.getReloadCount();
    const payment = await store.get("payment");
    if (count >= 3) {
      if (payment) this.refund(payment.transaction_id);
      ipcRenderer.send("main/error");
    } else {
      ipcRenderer.send("main/reload");
    }
  }

  public static refund(transaction_id: string) {
    this.#api.post("transaction/refund", {
      transaction_id: transaction_id,
    });
  }

  public static fallback() {
    this.#api.get("booth/error", {
      headers: {
        token: process.env.BOOTH_ID,
      },
    });
  }
}
