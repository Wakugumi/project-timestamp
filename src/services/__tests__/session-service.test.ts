import Session from "../session-service";
import { store } from "../../utilities/store-utility";

xdescribe("session services", () => {
  it("should initialize beginning of a session", async () => {
    Session.begin()
      .then(async () => {
        const state = await store.getState();
        expect(state).toEqual({
          phase: 1,
          payment: null,
          frame: null,
          canvas: null,
        });
      })
      .catch((reason) => {
        throw new Error(reason);
      });
  });

  it("should set session state to next phase", async () => {
    try {
      const before = (await store.getState()).phase;
      await Session.proceed();
      const after = (await store.getState()).phase;
      expect(after).toBeGreaterThan(before);
    } catch (error) {
      error;
    }
  });
});
