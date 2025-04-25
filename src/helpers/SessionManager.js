/**
 *
 * A singleton object that store application states.
 * Session is defined as a group of data (or state) that live throughout a single user flow (user session).
 * User flow is a sequential 'phase'(s) from one to eight, in one session, then reset after the renderer invoke ending the session
 */

"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSession =
  exports.setCanvas =
  exports.setFrame =
  exports.setPayment =
  exports.setPhase =
  exports.setPictures =
    void 0;
var toolkit_1 = require("@reduxjs/toolkit");
const { logger } = require("../utility/logger");
var initialState = {
  phase: 0,
  payment: null,
  frame: null,
  canvas: null,
  reload: 0,
  pictures: null,
};
var sessionSlice = (0, toolkit_1.createSlice)({
  name: "session",
  initialState: initialState,
  reducers: {
    setPhase: function (state, action) {
      logger.info(action);
      state.phase = action.payload;
    },
    nextPhase: function (state) {
      logger.info("nextPhase", state.phase + 1);
      state.phase++;
    },
    setPayment: function (state, action) {
      logger.info("payment", action);
      state.payment = action.payload;
    },
    setFrame: function (state, action) {
      state.frame = action.payload;
    },
    setCanvas: function (state, action) {
      state.canvas = action.payload;
    },
    setPictures: function (state, action) {
      state.pictures = action.payload;
    },
    resetSession: function () {
      return initialState;
    },
    incrementReload: function (state) {
      state.reload++;
    },
  },
});
(exports.setPhase = ((_a = sessionSlice.actions), _a.setPhase)),
  (exports.setPayment = _a.setPayment),
  (exports.setFrame = _a.setFrame),
  (exports.setCanvas = _a.setCanvas),
  (exports.setPictures = _a.setPictures),
  (exports.resetSession = _a.resetSession),
  (exports.nextPhase = _a.nextPhase),
  (exports.incrementReload = _a.incrementReload);
var store = (0, toolkit_1.configureStore)({
  reducer: {
    session: sessionSlice.reducer,
  },
});
exports.store = store;
