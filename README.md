# MediaPreviewTools

# 富媒体阅览工具组件

![image](https://github.com/KrazyPhish/MediaPreviewTools/blob/main/src/assets/dev.png)

![image2](https://github.com/KrazyPhish/MediaPreviewTools/blob/main/src/assets/dev2.png)

![image3](https://github.com/KrazyPhish/MediaPreviewTools/blob/main/src/assets/dev3.png)

![image4](https://github.com/KrazyPhish/MediaPreviewTools/blob/main/src/assets/dev4.png)

## 支持媒体格式

支持视频、音频、图片、PDF、Email和Office等文本格式

其中视频、音频、图片和PDF都仅支持符合W3C规范的能由现代浏览器直接打开的格式文件如：

视频：mp4, wmv, mpeg, mkv, avi, mov, flv, rmvb

音频：mp3, wma, wav, aac, flac, ogg

图片：jpg, jpeg, bmp, tif, png, eps, gif, svg, ai, psd

PDF：任意PDF

Office、Email：所有格式的Office如ppt，doc等以及Email邮件格式都应由服务端转换为HTML后交付前端再展示

## 必要依赖（需要手动下载npm install的依赖）

Vue3

@vueuse/core

element-plus

## 其他依赖（以模块的形式集成在组件中，不需要额外下载）

viewer.js

wavesurfer.js

popper.js

## 如何使用

整个组件都集成在目录 src/component/MediaTools 文件夹中

在其他项目中使用时直接将该文件夹迁移使用即可（并保证上述必要依赖已经下载）

App.vue仅用于测试代码，可以大致观察组件的运行方式和逻辑

## 可扩展性

该项目中的各种子组件也是可以单独使用的，面对不同的场景如：

CommonPopover（自定义气泡，与ElPopover类似） CommonToolbar（播放控件栏，可自定义功能按钮） 等

wavesurfer（https://wavesurfer-js.org/） 和 popper（https://popper.js.org/） 都是很强大的插件

如果有更多深入的定制功能，都可以在基于该组件和上述插件扩展开发

如本组件中的关于音频内容的分区域展示、播放等扩展功能其实就是属于定制化的内容

## 配置化

所有的播放器功能都是可配置化的，针对特定的需求选择需要的内容如控件按钮、功能等

## 其他

左侧的+、-按钮用于浏览Office和Email文件时使用按钮使其放大或缩小

这部分逻辑需要在Office或Email源文件转换为HTML时由负责转换的后端将其写入对应的HTML文件的script标签当中

本项目提供的测试文件中可以找到具体的代码逻辑，也可以测试成功
