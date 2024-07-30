(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.QuillResizeModule = factory());
}(this, (function () { 'use strict';

    function __$styleInject(css) {
        if (!css) return;

        if (typeof window == 'undefined') return;
        var style = document.createElement('style');
        style.setAttribute('media', 'screen');

        style.innerHTML = css;
        document.head.appendChild(style);
        return css;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    __$styleInject("#editor-resizer {\n  position: absolute;\n  border: 1px dashed #fff;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#editor-resizer .handler {\n  position: absolute;\n  right: -5px;\n  bottom: -5px;\n  width: 10px;\n  height: 10px;\n  border: 1px solid #333;\n  background-color: rgba(255, 255, 255, 0.8);\n  cursor: nwse-resize;\n  user-select: none;\n}\n#editor-resizer .toolbar {\n  position: absolute;\n  bottom: -3em;\n  left: 50%;\n  padding: 0.5em;\n  border: 1px solid #fff;\n  border-radius: 3px;\n  background-color: #fff;\n  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);\n  transform: translateX(-50%);\n  width: 200px;\n}\n#editor-resizer .toolbar .group {\n  display: flex;\n  border: 1px solid #aaa;\n  border-radius: 6px;\n  white-space: nowrap;\n  text-align: center;\n  line-height: 2;\n  color: rgba(0, 0, 0, 0.65);\n}\n#editor-resizer .toolbar .group:not(:first-child) {\n  margin-top: 0.5em;\n}\n#editor-resizer .toolbar .group .btn {\n  flex: 1 0 0;\n  text-align: center;\n  width: 25%;\n  padding: 0 1rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  vertical-align: top;\n  user-select: none;\n  color: inherit;\n  cursor: pointer;\n}\n#editor-resizer .toolbar .group .btn:not(:last-child) {\n  border-right: 1px solid #bbb;\n}\n#editor-resizer .toolbar .group .btn:not(.btn-group):active {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n#editor-resizer .toolbar .group .btn img {\n  width: 16px;\n  height: 16px;\n  pointer-events: none;\n}\n#editor-resizer .toolbar .group .input-wrapper {\n  width: 25%;\n  border: 1px solid #eee;\n  position: relative;\n  border-right: 1px solid #bbb;\n  min-width: 4em;\n}\n#editor-resizer .toolbar .group .input-wrapper::after {\n  content: \" \";\n  position: absolute;\n  height: 1px;\n  background-color: #333;\n  left: 0.5em;\n  right: 1em;\n  bottom: 0.2em;\n}\n#editor-resizer .toolbar .group .input-wrapper input {\n  color: inherit;\n  text-align: center;\n  width: 100%;\n  border: none;\n  outline: none;\n  padding: 0 0.5em;\n  padding-right: 1.5em;\n}\n#editor-resizer .toolbar .group .input-wrapper input:focus ~ .tooltip {\n  display: block;\n}\n#editor-resizer .toolbar .group .input-wrapper .suffix {\n  position: absolute;\n  right: 0.5em;\n}\n#editor-resizer .toolbar .group .input-wrapper .tooltip {\n  display: none;\n  position: absolute;\n  top: 100%;\n  left: 0;\n  font-size: small;\n  background-color: #fff;\n  box-shadow: 0 0 3px #a7a7a7;\n  padding: 0 0.6em;\n  border-radius: 5px;\n  zoom: 0.85;\n}\n");

    var I18n = /** @class */ (function () {
        function I18n(config) {
            this.config = __assign(__assign({}, defaultLocale), config);
        }
        I18n.prototype.findLabel = function (key) {
            if (this.config) {
                return Reflect.get(this.config, key);
            }
            return null;
        };
        return I18n;
    }());
    var defaultLocale = {
        floatLeft: "left",
        floatRight: "right",
        center: "center",
        restore: "restore",
        altTip: "Press and hold alt to lock ratio!",
        inputTip: "Press enter key to apply change!",
    };

    function format(str) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return str.replace(/\{(\d+)\}/g, function (match, index) {
            if (values.length > index) {
                return values[index];
            }
            else {
                return "";
            }
        });
    }

    var ResizeElement = /** @class */ (function (_super) {
        __extends(ResizeElement, _super);
        function ResizeElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.originSize = null;
            return _this;
        }
        return ResizeElement;
    }(HTMLElement));
    var template = "\n<div class=\"handler\" title=\"{0}\"></div>\n<div class=\"toolbar\">\n  <div class=\"group\">\n    <span class=\"btn\" data-type=\"align\" data-styles=\"float:left\" title=\"\u5DE6\u5BF9\u9F50\">\n        <img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTIwNC44IDIwNC44aDYxNC40djEwMi40SDIwNC44ek0yMDQuOCA0NjAuOGg0MDkuNnYxMDIuNEgyMDQuOHpNMjA0LjggNzE2LjhoMjU2djEwMi40SDIwNC44eiIgLz48L3N2Zz4=\" alt=\"\u5DE6\u5BF9\u9F50\"/>\n    </span>\n    <span class=\"btn\" data-type=\"align\" title=\"\u4E2D\u95F4\u5BF9\u9F50\" data-styles=\"display:block;margin:auto;\">\n        <img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzIyMjk5ODE0NDk2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4ODMzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiPjxwYXRoIGQ9Ik0xNjAgMTU5bTM2IDBsNjgyIDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtNjgyIDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNCI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjkgNDc2bTM2IDBsMzQ0IDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtMzQ0IDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNSI+PC9wYXRoPjxwYXRoIGQ9Ik0yMzMgNzkzbTM2IDBsNTM2IDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtNTM2IDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNiI+PC9wYXRoPjwvc3ZnPg==\" alt=\"\u4E2D\u95F4\u5BF9\u9F50\"/>\n    </span>\n    <span class=\"btn\" data-type=\"align\" data-styles=\"float:right;\" title=\"\u53F3\u5BF9\u9F50\">\n        <img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTIwNC44IDIwNC44aDYxNC40djEwMi40SDIwNC44ek00MDkuNiA0NjAuOGg0MDkuNnYxMDIuNEg0MDkuNnpNNTYzLjIgNzE2LjhoMjU2djEwMi40aC0yNTZ6IiAvPjwvc3ZnPg==\" alt=\"\u53F3\u5BF9\u9F50\"/>\n    </span>\n    <span class=\"btn\" data-type=\"align\" data-styles=\"\" title=\"\u8FD8\u539F\">\n        <img src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTE5MiA2MzEuM2MtNi45IDAtMTMuOC0yLjktMTguOC04LjVsLTY3LjctNzYuN2MtOS4xLTEwLjQtOC4xLTI2LjIgMi4yLTM1LjMgMTAuNC05LjEgMjYuMi04LjEgMzUuMyAyLjJsNjcuNyA3Ni43YzkuMSAxMC40IDguMSAyNi4yLTIuMiAzNS4zLTQuNyA0LjMtMTAuNiA2LjMtMTYuNSA2LjN6IG03LjMgNS4zYy03IDAtMTQtMi45LTE4LjktOC43LTktMTAuNS03LjktMjYuMiAyLjYtMzUuM2w4MS43LTcwLjVjMTAuNS05IDI2LjItNy45IDM1LjMgMi42czcuOSAyNi4yLTIuNiAzNS4zbC04MS43IDcwLjVjLTQuOCA0LjEtMTAuNiA2LjEtMTYuNCA2LjF6IG0zMzMuMSAyNzMuMmMtMTYuNiAwLTMwLTEzLjQtMzAtMzBzMTMuNC0zMCAzMC0zMGMxNjQuOSAwIDI5OS4xLTEzNC4yIDI5OS4xLTI5OS4xUzY5Ny4zIDI1MS42IDUzMi40IDI1MS42Yy0xNjQuOSAwLTI5OS4xIDEzNC4yLTI5OS4xIDI5OS4xIDAgMTYuNi0xMy40IDMwLTMwIDMwcy0zMC0xMy40LTMwLTMwYzAtNDguNSA5LjUtOTUuNSAyOC4yLTEzOS44IDE4LjEtNDIuOCA0NC04MS4yIDc2LjktMTE0LjEgMzMtMzMgNzEuNC01OC45IDExNC4xLTc2LjkgNDQuMy0xOC43IDkxLjMtMjguMiAxMzkuOC0yOC4yczk1LjUgOS41IDEzOS44IDI4LjJjNDIuOCAxOC4xIDgxLjIgNDQgMTE0LjEgNzYuOSAzMyAzMyA1OC45IDcxLjQgNzYuOSAxMTQuMSAxOC43IDQ0LjMgMjguMiA5MS4zIDI4LjIgMTM5LjggMCA0OC41LTkuNSA5NS41LTI4LjIgMTM5LjgtMTguMSA0Mi44LTQ0IDgxLjItNzYuOSAxMTQuMS0zMyAzMy03MS40IDU4LjktMTE0LjEgNzYuOS00NC4yIDE4LjgtOTEuMiAyOC4zLTEzOS43IDI4LjN6IiAgLz48L3N2Zz4=\" alt=\"\u8FD8\u539F\"/>\n    </span>\n  </div>\n</div>\n";
    var ResizePlugin = /** @class */ (function () {
        function ResizePlugin(resizeTarget, container, options) {
            this.resizer = null;
            this.startResizePosition = null;
            this.i18n = new I18n((options === null || options === void 0 ? void 0 : options.locale) || defaultLocale);
            this.options = options;
            this.resizeTarget = resizeTarget;
            if (!resizeTarget.originSize) {
                resizeTarget.originSize = {
                    width: resizeTarget.clientWidth,
                    height: resizeTarget.clientHeight,
                };
            }
            this.container = container;
            this.initResizer();
            this.positionResizerToTarget(resizeTarget);
            this.resizing = this.resizing.bind(this);
            this.endResize = this.endResize.bind(this);
            this.startResize = this.startResize.bind(this);
            this.toolbarClick = this.toolbarClick.bind(this);
            this.toolbarInputChange = this.toolbarInputChange.bind(this);
            this.bindEvents();
        }
        ResizePlugin.prototype.initResizer = function () {
            var resizer = this.container.querySelector("#editor-resizer");
            if (!resizer) {
                resizer = document.createElement("div");
                resizer.setAttribute("id", "editor-resizer");
                resizer.innerHTML = format(template, this.i18n.findLabel("altTip"), this.i18n.findLabel("floatLeft"), this.i18n.findLabel("center"), this.i18n.findLabel("floatRight"), this.i18n.findLabel("restore"), this.i18n.findLabel("inputTip"));
                this.container.appendChild(resizer);
            }
            this.resizer = resizer;
        };
        ResizePlugin.prototype.positionResizerToTarget = function (el) {
            var _a;
            if (this.resizer !== null) {
                this.resizer.style.setProperty("left", el.offsetLeft + "px");
                this.resizer.style.setProperty("top", el.offsetTop + "px");
                this.resizer.style.setProperty("width", el.clientWidth + "px");
                this.resizer.style.setProperty("height", el.clientHeight + "px");
                var newDiv = document.createElement("div");
                newDiv.setAttribute("id", "size-content");
                newDiv.innerHTML = "\n  <div style=\"position: absolute; font: 12px / 1 Arial, Helvetica, sans-serif; padding: 4px 8px; text-align: center; background-color: white; color: rgb(51, 51, 51); border: 1px solid rgb(119, 119, 119); box-sizing: border-box; opacity: 0.8; cursor: default; right: 4px; bottom: 4px; left: auto;\">" + el.clientWidth + " * " + el.clientHeight + "</div>\n";
                //删除已有的div
                if (document.querySelector("#size-content")) {
                    (_a = document.querySelector("#size-content")) === null || _a === void 0 ? void 0 : _a.remove();
                }
                this.resizer.appendChild(newDiv);
            }
        };
        ResizePlugin.prototype.bindEvents = function () {
            if (this.resizer !== null) {
                this.resizer.addEventListener("mousedown", this.startResize);
                this.resizer.addEventListener("click", this.toolbarClick);
                this.resizer.addEventListener("change", this.toolbarInputChange);
            }
            window.addEventListener("mouseup", this.endResize);
            window.addEventListener("mousemove", this.resizing);
        };
        ResizePlugin.prototype._setStylesForToolbar = function (type, styles) {
            var _a;
            var storeKey = "_styles_" + type;
            if (type === 'align' && !styles) {
                this.resizeTarget.style.width = 'auto';
                this.resizeTarget.style.height = 'auto';
            }
            var style = this.resizeTarget.style;
            var originStyles = this.resizeTarget[storeKey];
            style.cssText =
                style.cssText.replaceAll(" ", "").replace(originStyles, "") +
                    (";" + styles);
            this.resizeTarget[storeKey] = styles;
            this.positionResizerToTarget(this.resizeTarget);
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        ResizePlugin.prototype.toolbarInputChange = function (e) {
            var _a;
            var target = e.target;
            var type = (_a = target === null || target === void 0 ? void 0 : target.dataset) === null || _a === void 0 ? void 0 : _a.type;
            var value = target.value;
            if (type && Number(value)) {
                this._setStylesForToolbar(type, "width: " + Number(value) + "%;");
            }
        };
        ResizePlugin.prototype.toolbarClick = function (e) {
            var _a, _b;
            var target = e.target;
            var type = (_a = target === null || target === void 0 ? void 0 : target.dataset) === null || _a === void 0 ? void 0 : _a.type;
            if (type && target.classList.contains("btn")) {
                this._setStylesForToolbar(type, (_b = target === null || target === void 0 ? void 0 : target.dataset) === null || _b === void 0 ? void 0 : _b.styles);
            }
        };
        ResizePlugin.prototype.startResize = function (e) {
            var target = e.target;
            if (target.classList.contains("handler") && e.which === 1) {
                this.startResizePosition = {
                    left: e.clientX,
                    top: e.clientY,
                    width: this.resizeTarget.clientWidth,
                    height: this.resizeTarget.clientHeight,
                };
            }
        };
        ResizePlugin.prototype.endResize = function () {
            var _a;
            this.startResizePosition = null;
            (_a = this.options) === null || _a === void 0 ? void 0 : _a.onChange(this.resizeTarget);
        };
        ResizePlugin.prototype.resizing = function (e) {
            if (!this.startResizePosition)
                return;
            var deltaX = e.clientX - this.startResizePosition.left;
            var deltaY = e.clientY - this.startResizePosition.top;
            var width = this.startResizePosition.width;
            var height = this.startResizePosition.height;
            width += deltaX;
            height += deltaY;
            if (e.altKey) {
                var originSize = this.resizeTarget.originSize;
                var rate = originSize.height / originSize.width;
                height = rate * width;
            }
            this.resizeTarget.style.setProperty("width", Math.max(width, 80) + "px");
            this.resizeTarget.style.setProperty("height", Math.max(height, 30) + "px");
            this.positionResizerToTarget(this.resizeTarget);
        };
        ResizePlugin.prototype.destory = function () {
            this.container.removeChild(this.resizer);
            window.removeEventListener("mouseup", this.endResize);
            window.removeEventListener("mousemove", this.resizing);
            this.resizer = null;
        };
        return ResizePlugin;
    }());

    var Iframe = /** @class */ (function () {
        function Iframe(element, cb) {
            this.element = element;
            this.cb = cb;
            this.hasTracked = false;
        }
        return Iframe;
    }());
    var IframeClick = /** @class */ (function () {
        function IframeClick() {
        }
        IframeClick.track = function (element, cb) {
            this.iframes.push(new Iframe(element, cb));
            if (!this.interval) {
                this.interval = setInterval(function () {
                    IframeClick.checkClick();
                }, this.resolution);
            }
        };
        IframeClick.checkClick = function () {
            if (document.activeElement) {
                var activeElement = document.activeElement;
                for (var i in this.iframes) {
                    if (activeElement === this.iframes[i].element) {
                        if (this.iframes[i].hasTracked == false) {
                            this.iframes[i].cb.apply(window, []);
                            this.iframes[i].hasTracked = true;
                        }
                    }
                    else {
                        this.iframes[i].hasTracked = false;
                    }
                }
            }
        };
        IframeClick.resolution = 200;
        IframeClick.iframes = [];
        IframeClick.interval = null;
        return IframeClick;
    }());

    function QuillResizeModule(quill, options) {
        var container = quill.root;
        var resizeTarge;
        var resizePlugin;
        function triggerTextChange() {
            var Delta = quill.getContents().constructor;
            var delta = new Delta().retain(1);
            quill.updateContents(delta);
        }
        container.addEventListener("click", function (e) {
            var target = e.target;
            if (e.target && ["img", "video"].includes(target.tagName.toLowerCase())) {
                resizeTarge = target;
                resizePlugin = new ResizePlugin(target, container.parentElement, __assign(__assign({}, options), { onChange: triggerTextChange }));
            }
        });
        quill.on("text-change", function (delta, source) {
            // iframe 大小调整
            container.querySelectorAll("iframe").forEach(function (item) {
                IframeClick.track(item, function () {
                    resizeTarge = item;
                    resizePlugin = new ResizePlugin(item, container.parentElement, __assign(__assign({}, options), { onChange: triggerTextChange }));
                });
            });
        });
        document.addEventListener("mousedown", function (e) {
            var _a, _b, _c;
            var target = e.target;
            if (target !== resizeTarge &&
                !((_b = (_a = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.resizer) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, target))) {
                (_c = resizePlugin === null || resizePlugin === void 0 ? void 0 : resizePlugin.destory) === null || _c === void 0 ? void 0 : _c.call(resizePlugin);
                resizePlugin = null;
                resizeTarge = null;
            }
        }, { capture: true });
    }

    return QuillResizeModule;

})));
