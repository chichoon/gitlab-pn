var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var pnMap;
chrome.storage.local.onChanged.addListener(function (changes) {
    var map = Object.entries(changes).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], _c = _a[1], newValue = _c.newValue, oldValue = _c.oldValue;
        pnMap[key] = newValue || key;
        return __assign(__assign({}, acc), (_b = {}, _b[oldValue || key] = newValue || key, _b));
    }, {});
    replaceText(map);
    replacePnText(pnMap);
});
function replaceText(replacementMap) {
    var notes = document.querySelectorAll(".discussion-body div.note-body > div.note-text.md [data-sourcepos][dir='auto']");
    notes.forEach(function (note) {
        Object.keys(replacementMap).some(function (key) {
            var _a, _b;
            var pnRegex = new RegExp("(?<rule>".concat(key, ") [:]"));
            var match = (_a = note.textContent) === null || _a === void 0 ? void 0 : _a.match(pnRegex);
            if (match && match[1] && note.textContent) {
                var replacement = replacementMap[match[1]];
                note.textContent = (_b = note.textContent) === null || _b === void 0 ? void 0 : _b.replace(pnRegex, "".concat(replacement || "$<rule>", " :"));
            }
            return match;
        });
    });
}
function replacePnText(replacementMap) {
    var notes = document.querySelectorAll(".discussion-body div.note-body > div.note-text.md [data-sourcepos][dir='auto']");
    notes.forEach(function (note) {
        var _a;
        var pnRegex = /\s*(?<rule>[pP]\d)\s*[:.]?/;
        var match = (_a = note.textContent) === null || _a === void 0 ? void 0 : _a.match(pnRegex);
        if (match && match[1] && match[1].toLowerCase() in replacementMap && note.textContent) {
            var replacement = replacementMap[match[1].toLowerCase()];
            note.textContent = note.textContent.replace(pnRegex, "".concat(replacement || "$<rule>", " :"));
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(pnMap == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, chrome.storage.local.get(["p1", "p2", "p3"]).then(function (data) {
                            pnMap = data;
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, pnMap];
            }
        });
    });
}
new MutationObserver(function (mutations) {
    init().then(function (_map) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                replacePnText(_map);
            }
        });
    });
}).observe(document.body, {
    childList: true,
    subtree: true,
});
init();
