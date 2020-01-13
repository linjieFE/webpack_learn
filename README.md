#Webpack主要优势
> webpack-dev-server 搭建本地环境，进行热更新
> 预处理（less,sass,es6,typescript...）
> 图片添加hash 方便线上CDN 缓存
> 自动处理css3属性前缀
> 单文件多文件打包
> 模块化开发
> js压缩，按需加载

## webpack4
> 增加了mode属性 development 或 production

```bash
"script":{
    "dev":"webpack --mode development",
    "build":"webpack --mode production"
} 
```
通过mode 可以轻松设置打包环境

> Tree-shaking  打包前自动清除无用的文件引用。。。
## 全局安装

```bash

npm install webpack -g
npm install webpack --save-dev  =>开发环境
npm install webpack --save =>线上开发包

devDependences :开发时的依赖包
devpendences :运行程序时的依赖包

```
或 (我自已习惯用yarn，本例用的下面初始化)
```

yarn global add webpack webpack-cli => webpack4 需要同时安装一个cli
yarn add webpack webpack-cli  --dev
yarn add webpack

```

## 初始化项目 npm init 生成一个package.json
> step1
```
npm init
```
> step2
```
yarn global add webpack webpack-cli 
```
> step3
```
yarn add webpack webpack-cli  --dev
```

> step4 

webpack 默认打包 src/index.js 生成dist文件，如src下有index.js ,终端下直接执行webpack生成dist打包
```
webpack
```
> 指定文件打包 (压缩成一行)
```
webpack src/test.js --output test01/test.js
webpack <需要打包目录/文件> --output <打包输出指定目录/文件>
```
> 后缀加 --mode none (不压缩)
```
webpack src/test.js --output test01/test.js
webpack <需要打包目录/文件> --output <打包输出指定目录/文件> --mode none
```

## 服务搭建
```
yarn global add http-server
```
终端成一个带端口的服务地址
```
http-server dist
```

http://127.0.0.1:8082/
地址自动访问到dist/index.html


