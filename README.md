<<<<<<< HEAD
# QUILL-RESIZE-MODULE
基于[scrapooo/quill-resize-module](https://github.com/scrapooo/quill-resize-module)上做出部分修改以符合自己的项目需求    
1.右下角新增图片尺寸显示    
2.修改快捷按钮，还原会重置图片位置和大小
## Demo
![image](https://github.com/user-attachments/assets/9dcd7172-15da-4ec3-94e7-e2d80544c32e)
## Usage

### Webpack/ES6

`npm install @majintd/quill-image-resize`

```javascript
import Quill from "quill";
import ResizeModule from "@majintd/quill-image-resize";

Quill.register("modules/resize", ResizeModule);

const quill = new Quill(editor, {
  modules: {
    resize: {
      
    },
  },
});
```

### browser

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link
      crossorigin="anonymous"
      integrity="sha384-7kltdnODhBho8GSWnwD9l9rilXkpuia4Anp4TKHPOrp8/MS/+083g4it4MYED/hc"
      href="http://lib.baomitu.com/quill/2.0.0-dev.3/quill.snow.min.css"
      rel="stylesheet"
    />
    <script
      crossorigin="anonymous"
      integrity="sha384-MDio1/ps0nK1tabxUqZ+1w2NM9faPltR1mDqXcNleeuiSi0KBXqIsWofIp4r5A0+"
      src="http://lib.baomitu.com/quill/2.0.0-dev.3/quill.min.js"
    ></script>
    <script src="../dist/quill-resize-module.js"></script>
  </head>
  <body>
    <div id="editor">
      <p>Hello World!</p>
      <p>Some initial <strong>bold</strong> text</p>
      <p><br /></p>
    </div>
  </body>
  <script>
    Quill.register("modules/resize", window.QuillResizeModule);

    var toolbarOptions = [
      "bold",
      "italic",
      "underline",
      "strike",
      "image",
      "video",
    ];
    var quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
        resize: {
          locale: {
            center: "center",
          },
        },
      },
    });
  </script>
</html>
```
=======
# quill-image-resize
修改自scrapooo/quill-resize-module部分代码适用自己的项目
>>>>>>> 23ec56cfe7161c87a50036455a9e1ecbb4469c66
