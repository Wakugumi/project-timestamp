"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var lowdb_1 = require("lowdb");
var node_1 = require("lowdb/node");
var path_1 = require("path");
var electron_1 = require("electron");
var defaultState = {
    phase: 0,
    payment: null,
    frame: null,
    canvas: null,
    reload: 0,
    quantity: 1,
};
var file = (0, path_1.join)(electron_1.app.getPath("userData"), "appState.json");
var adapter = new node_1.JSONFile(file);
var db = new lowdb_1.Low(adapter, defaultState);
var init = false;
function lazyInit() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!init) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.read()];
                case 1:
                    _a.sent();
                    db.data || (db.data = defaultState);
                    return [4 /*yield*/, db.write()];
                case 2:
                    _a.sent();
                    init = true;
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * store object of state database repository, everything is async process
 */
var store = {
    lazyInit: lazyInit,
    log: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        console.log(db.data);
                        return [2 /*return*/];
                }
            });
        });
    },
    getState: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, db.data];
                }
            });
        });
    },
    get: function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, db.data[key]];
                }
            });
        });
    },
    /**
     * Set current state's data with specified object of key value pair
     * Use {ISession} interface to populate the object
     */
    set: function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db.data[key] = value;
                        return [4 /*yield*/, db.write()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Increment state's phase number by one
     */
    phaseIncrement: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        db.data["phase"]++;
                        return [4 /*yield*/, db.write()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Reset store data to default state
     */
    reset: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        db.data = defaultState;
                        return [4 /*yield*/, db.write()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // add 'reload' state by one
    reloadIncrement: function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        db.data["reload"]++;
                        return [4 /*yield*/, db.write()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    getReloadCount: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lazyInit()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, db.data["reload"]];
                }
            });
        });
    },
};
exports.store = store;
