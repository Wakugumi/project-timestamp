import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";
import { app } from "electron";

import ISession from "../interfaces/ISession";

const defaultState: ISession = {
  phase: 1,
  payment: null,
  frame: null,
  canvas: null,
  reload: 0,
  quantity: 1,
};

const file = join(app.getPath("userData"), "appState.json");
const adapter = new JSONFile<ISession>(file);
const db = new Low<ISession>(adapter, defaultState);
let init = false;

async function lazyInit() {
  if (!init) {
    await db.read();
    db.data ||= defaultState;
    await db.write();
    init = true;
  }
}

/**
 * store object of state database repository, everything is async process
 */
const store = {
  lazyInit,
  async log() {
    await lazyInit();
    console.log(db.data);
  },
  async getState(): Promise<ISession> {
    await lazyInit();
    return db.data;
  },

  async get<K extends keyof ISession>(key: K): Promise<ISession[K]> {
    await lazyInit();
    return db.data[key];
  },

  /**
   * Set current state's data with specified object of key value pair
   * Use {ISession} interface to populate the object
   */
  async set<K extends keyof ISession>(
    key: K,
    value: ISession[K],
  ): Promise<void> {
    db.data[key] = value;
    await db.write();
  },

  /**
   * Increment state's phase number by one
   */
  async phaseIncrement() {
    try {
      await lazyInit();
      db.data["phase"]++;
      await db.write();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset store data to default state
   */
  async reset() {
    try {
      await lazyInit();
      db.data = defaultState;
      await db.write();
    } catch (error) {
      throw error;
    }
  },

  // add 'reload' state by one
  async reloadIncrement() {
    try {
      await lazyInit();
      db.data["reload"]++;
      await db.write();
    } catch (error) {
      throw error;
    }
  },

  async getReloadCount() {
    await lazyInit();
    return db.data["reload"];
  },
};

export { store };
