"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSession =
  exports.setCanvas =
  exports.setFrame =
  exports.setPayment =
  exports.setPhase =
    void 0;
var toolkit_1 = require("@reduxjs/toolkit");
const { logger } = require("../utility/logger");
var initialState = {
  phase: 0,
  payment: null,
  frame: null,
  canvas: null,
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
    resetSession: function () {
      return initialState;
    },
  },
});
(exports.setPhase = ((_a = sessionSlice.actions), _a.setPhase)),
  (exports.setPayment = _a.setPayment),
  (exports.setFrame = _a.setFrame),
  (exports.setCanvas = _a.setCanvas),
  (exports.resetSession = _a.resetSession),
  (exports.nextPhase = _a.nextPhase);
var store = (0, toolkit_1.configureStore)({
  reducer: {
    session: sessionSlice.reducer,
  },
});
exports.store = store;
