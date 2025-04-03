"use strict";
/**
 * Exposes function call to global object 'window' in renderer process
 */
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    invoke: function (channel, data) { return electron_1.ipcRenderer.invoke(channel, data); },
    send: function (channel, data) { return electron_1.ipcRenderer.send(channel, data); },
    on: function (channel, callback) {
        electron_1.ipcRenderer.on(channel, function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return callback.apply(void 0, args);
        });
    },
    onVideo: function (callback) {
        electron_1.ipcRenderer.on("video", function (event, data) {
            callback(data);
        });
    },
    onStream: function (callback) {
        return electron_1.ipcRenderer.on("liveview", function (_, frame) { return callback(frame); });
    },
    onStateUpdate: function (callback) {
        return electron_1.ipcRenderer.on("state-update", function (_, state) { return callback(state); });
    },
    testError: function () {
        throw new Error("This is a test error");
    },
});
