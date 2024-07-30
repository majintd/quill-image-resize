import "./ResizePlugin.less";
import {I18n, Locale, defaultLocale} from "./i18n";
import {format} from "./utils";

interface Size {
    width: number;
    height: number;
}

interface Position {
    left: number;
    top: number;
    width: number;
    height: number;
}

class ResizeElement extends HTMLElement {
    public originSize?: Size | null = null;

    [key: string]: any;
}

interface ResizePluginOption {
    locale?: Locale;

    [index: string]: any;
}

const template = `
<div class="handler" title="{0}"></div>
<div class="toolbar">
  <div class="group">
    <span class="btn" data-type="align" data-styles="float:left" title="左对齐">
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTIwNC44IDIwNC44aDYxNC40djEwMi40SDIwNC44ek0yMDQuOCA0NjAuOGg0MDkuNnYxMDIuNEgyMDQuOHpNMjA0LjggNzE2LjhoMjU2djEwMi40SDIwNC44eiIgLz48L3N2Zz4=" alt="左对齐"/>
    </span>
    <span class="btn" data-type="align" title="中间对齐" data-styles="display:block;margin:auto;">
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzIyMjk5ODE0NDk2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4ODMzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiPjxwYXRoIGQ9Ik0xNjAgMTU5bTM2IDBsNjgyIDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtNjgyIDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNCI+PC9wYXRoPjxwYXRoIGQ9Ik0zMjkgNDc2bTM2IDBsMzQ0IDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtMzQ0IDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNSI+PC9wYXRoPjxwYXRoIGQ9Ik0yMzMgNzkzbTM2IDBsNTM2IDBxMzYgMCAzNiAzNmwwIDBxMCAzNi0zNiAzNmwtNTM2IDBxLTM2IDAtMzYtMzZsMCAwcTAtMzYgMzYtMzZaIiBmaWxsPSIjOGE4YThhIiBwLWlkPSIyODgzNiI+PC9wYXRoPjwvc3ZnPg==" alt="中间对齐"/>
    </span>
    <span class="btn" data-type="align" data-styles="float:right;" title="右对齐">
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTIwNC44IDIwNC44aDYxNC40djEwMi40SDIwNC44ek00MDkuNiA0NjAuOGg0MDkuNnYxMDIuNEg0MDkuNnpNNTYzLjIgNzE2LjhoMjU2djEwMi40aC0yNTZ6IiAvPjwvc3ZnPg==" alt="右对齐"/>
    </span>
    <span class="btn" data-type="align" data-styles="" title="还原">
        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1Ni4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iI2JmYmZiZiIgZD0iTTE5MiA2MzEuM2MtNi45IDAtMTMuOC0yLjktMTguOC04LjVsLTY3LjctNzYuN2MtOS4xLTEwLjQtOC4xLTI2LjIgMi4yLTM1LjMgMTAuNC05LjEgMjYuMi04LjEgMzUuMyAyLjJsNjcuNyA3Ni43YzkuMSAxMC40IDguMSAyNi4yLTIuMiAzNS4zLTQuNyA0LjMtMTAuNiA2LjMtMTYuNSA2LjN6IG03LjMgNS4zYy03IDAtMTQtMi45LTE4LjktOC43LTktMTAuNS03LjktMjYuMiAyLjYtMzUuM2w4MS43LTcwLjVjMTAuNS05IDI2LjItNy45IDM1LjMgMi42czcuOSAyNi4yLTIuNiAzNS4zbC04MS43IDcwLjVjLTQuOCA0LjEtMTAuNiA2LjEtMTYuNCA2LjF6IG0zMzMuMSAyNzMuMmMtMTYuNiAwLTMwLTEzLjQtMzAtMzBzMTMuNC0zMCAzMC0zMGMxNjQuOSAwIDI5OS4xLTEzNC4yIDI5OS4xLTI5OS4xUzY5Ny4zIDI1MS42IDUzMi40IDI1MS42Yy0xNjQuOSAwLTI5OS4xIDEzNC4yLTI5OS4xIDI5OS4xIDAgMTYuNi0xMy40IDMwLTMwIDMwcy0zMC0xMy40LTMwLTMwYzAtNDguNSA5LjUtOTUuNSAyOC4yLTEzOS44IDE4LjEtNDIuOCA0NC04MS4yIDc2LjktMTE0LjEgMzMtMzMgNzEuNC01OC45IDExNC4xLTc2LjkgNDQuMy0xOC43IDkxLjMtMjguMiAxMzkuOC0yOC4yczk1LjUgOS41IDEzOS44IDI4LjJjNDIuOCAxOC4xIDgxLjIgNDQgMTE0LjEgNzYuOSAzMyAzMyA1OC45IDcxLjQgNzYuOSAxMTQuMSAxOC43IDQ0LjMgMjguMiA5MS4zIDI4LjIgMTM5LjggMCA0OC41LTkuNSA5NS41LTI4LjIgMTM5LjgtMTguMSA0Mi44LTQ0IDgxLjItNzYuOSAxMTQuMS0zMyAzMy03MS40IDU4LjktMTE0LjEgNzYuOS00NC4yIDE4LjgtOTEuMiAyOC4zLTEzOS43IDI4LjN6IiAgLz48L3N2Zz4=" alt="还原"/>
    </span>
  </div>
</div>
`;

class ResizePlugin {
    resizeTarget: ResizeElement;
    resizer: HTMLElement | null = null;
    container: HTMLElement;
    startResizePosition: Position | null = null;
    i18n: I18n;
    options: any;

    constructor(
        resizeTarget: ResizeElement,
        container: HTMLElement,
        options?: ResizePluginOption
    ) {
        this.i18n = new I18n(options?.locale || defaultLocale);
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

    initResizer() {
        let resizer: HTMLElement | null =
            this.container.querySelector("#editor-resizer");
        if (!resizer) {
            resizer = document.createElement("div");
            resizer.setAttribute("id", "editor-resizer");
            resizer.innerHTML = format(
                template,
                this.i18n.findLabel("altTip"),
                this.i18n.findLabel("floatLeft"),
                this.i18n.findLabel("center"),
                this.i18n.findLabel("floatRight"),
                this.i18n.findLabel("restore"),
                this.i18n.findLabel("inputTip")
            );
            this.container.appendChild(resizer);
        }
        this.resizer = resizer;
    }

    positionResizerToTarget(el: HTMLElement) {
        if (this.resizer !== null) {
            this.resizer.style.setProperty("left", el.offsetLeft + "px");
            this.resizer.style.setProperty("top", el.offsetTop + "px");
            this.resizer.style.setProperty("width", el.clientWidth + "px");
            this.resizer.style.setProperty("height", el.clientHeight + "px");
            const newDiv = document.createElement("div");
            newDiv.setAttribute("id", "size-content")
            newDiv.innerHTML = `
  <div style="position: absolute; font: 12px / 1 Arial, Helvetica, sans-serif; padding: 4px 8px; text-align: center; background-color: white; color: rgb(51, 51, 51); border: 1px solid rgb(119, 119, 119); box-sizing: border-box; opacity: 0.8; cursor: default; right: 4px; bottom: 4px; left: auto;">${el.clientWidth} * ${el.clientHeight}</div>
`
            //删除已有的div
            if(document.querySelector("#size-content")){
                document.querySelector("#size-content")?.remove()
            }
            this.resizer.appendChild(newDiv)
        }
    }

    bindEvents() {
        if (this.resizer !== null) {
            this.resizer.addEventListener("mousedown", this.startResize);
            this.resizer.addEventListener("click", this.toolbarClick);
            this.resizer.addEventListener("change", this.toolbarInputChange);
        }
        window.addEventListener("mouseup", this.endResize);
        window.addEventListener("mousemove", this.resizing);
    }

    _setStylesForToolbar(type: string, styles: string | undefined) {
        const storeKey = `_styles_${type}`;
        if (type === 'align' && !styles) {
            this.resizeTarget.style.width = 'auto';
            this.resizeTarget.style.height = 'auto';
        }
        const style: CSSStyleDeclaration = this.resizeTarget.style;
        const originStyles = this.resizeTarget[storeKey];
        style.cssText =
            style.cssText.replaceAll(" ", "").replace(originStyles, "") +
            `;${styles}`;
        this.resizeTarget[storeKey] = styles;
        this.positionResizerToTarget(this.resizeTarget);
        this.options?.onChange(this.resizeTarget);
    }

    toolbarInputChange(e: Event) {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        const type = target?.dataset?.type;
        const value = target.value;
        if (type && Number(value)) {
            this._setStylesForToolbar(type, `width: ${Number(value)}%;`);
        }
    }

    toolbarClick(e: MouseEvent) {
        const target: HTMLElement = e.target as HTMLElement;
        const type = target?.dataset?.type;

        if (type && target.classList.contains("btn")) {
            this._setStylesForToolbar(type, target?.dataset?.styles);
        }
    }

    startResize(e: MouseEvent) {
        const target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains("handler") && e.which === 1) {
            this.startResizePosition = {
                left: e.clientX,
                top: e.clientY,
                width: this.resizeTarget.clientWidth,
                height: this.resizeTarget.clientHeight,
            };
        }
    }

    endResize() {
        this.startResizePosition = null;
        this.options?.onChange(this.resizeTarget);
    }

    resizing(e: MouseEvent) {
        if (!this.startResizePosition) return;
        const deltaX: number = e.clientX - this.startResizePosition.left;
        const deltaY: number = e.clientY - this.startResizePosition.top;
        let width = this.startResizePosition.width;
        let height = this.startResizePosition.height;
        width += deltaX;
        height += deltaY;

        if (e.altKey) {
            const originSize = this.resizeTarget.originSize as Size;
            const rate: number = originSize.height / originSize.width;
            height = rate * width;
        }

        this.resizeTarget.style.setProperty("width", Math.max(width, 80) + "px");
        this.resizeTarget.style.setProperty("height", Math.max(height, 30) + "px");
        this.positionResizerToTarget(this.resizeTarget);
    }

    destory() {
        this.container.removeChild(this.resizer as HTMLElement);
        window.removeEventListener("mouseup", this.endResize);
        window.removeEventListener("mousemove", this.resizing);
        this.resizer = null;
    }
}

export default ResizePlugin;
