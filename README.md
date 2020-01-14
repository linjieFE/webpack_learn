## Webpack主要优势
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

## 服务链接
```
yarn global add http-server
```
终端成一个带端口的服务地址
```
http-server dist
```

http://127.0.0.1:8082/
地址自动访问到dist/index.html
----------------------------------------------
## 服务搭建
> step1 新建 build 文件夹=>webpack.config.js

```javascript
const webpack =require("webpack")//引入webpack
const path =require("path")//引入path
const DIST_PATH=path.resolve(__dirname,'../dist')//打包到的文件路径
module.exports={
    //入口
    entry: path.resolve(__dirname,'../src/index.js'),//绝对路径
    //编译输出打包
    output:{
        path:DIST_PATH,
        filename:'index.js'
    },
    //模块解析
    module:{

    },
    //插件
    plugins:{

    },
    //开发服务器
    devServer:{
        
    }
}
```

> step2 
终端
```bash
webpack --config/webpack.config.js --mode development 
```
也可以直接把 命令写入package.json里 通过 终端 npm run build 执行

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack --config build/webpack.config.js --mode production"
}
```

## 搭建本地环境(启动热更新)
```
yarn add webpack-dev-server --dev
```

> 配置webpack.config.js
```bash
devServer:{
    hot:true,//是否热更新
    contentBase:DIST_PATH,//热更内存目录
    port:8088,//服务端口
    host:'0.0.0.0',//host地址
    historyApiFallback:true,//友好处理404
    open:true,//启动时自动打工一个页面
    useLocalIp:false,//是否在打包的时候用自己的IP
    https:false,//是否用https
    proxy:{ //处理跨域 (可利用正则等区配) 
        'api':'http://localhost:3000'   //另一个端口
    }
}
```
> 配置package.json

```
"scripts": {
    "dev" : "webpack-dev-server --config build/webpack.config.js --mode development"
}
```

> 终端npm run dev 访问 http://0.0.0.0:8088/index.js

## 多文件打包（1）
> webpack.config.js

```
module.exports={
    // 方式一：绝对路径 打包单个文件；
    entry: ENTRY_PATH+'/index.js', 
    // 方式二：多文件支持数组 ，多合并成一个
    entry: [ ENTRY_PATH+'/index.js', ENTRY_PATH+'文件名.js'] 
    // 方式三：对象格式{<文件名>:'<目录>'}
    entry:{
        index:ENTRY_PATH+'/index.js',
        test:ENTRY_PATH+'/test.js'
    },
    // 编译输出的路径
    output:{
        path:DIST_PATH,
        filename:'[name].js'// 对应entry的键名index, test
    }
}
```
## hash
> 方法一 打包时会把所有文件更新hash值
```
output:{
    filename:'[name].[hash].js'
}
```
方法二 打包时只更新改动文件的hash值
```
output:{
    filename:'[name].[chunkhash:8].js' //:8代表hash位数
}
```
 ## 多文件打包（2） glob插件
 > step1
 ```
 yarn add glob --dev
 ```
 > step2 -> webpack.config.js

 ```
const glob =  require('glob')

var entryFiles={}

let files = glob.sync(ENTRY_PATH+'/**/*.js')//用正则匹配所有目录下的js文件

console.log('打包文件',files)

files.forEach((file)=>{
    let subkey = file.match(/src\/(\S*)\.js/)[1]//文件名
    entryFiles[subkey]=file
})

entry:entryFiles,
 ```
 ## 优化webpack配置
 > step1 安装 html-webpack-plugin
```
yarn add html-webpack-plugin --dev
```
> step2 -> webpack.config.js
```javascript
//插件引入
const htmlWebpackPlugin =  require('html-webpack-plugin') //引用html插件

plugins:[
    new htmlWebpackPlugin({
        filename:DIST_PATH+'/index.html',//文件目录/文件名.html
        title:'测试',//html title 
        template:path.resolve(__dirname,'../index.html'),//模板文件
        inject:true,//body head true false,默认true =》代表打包出来的script标签位于html底部
        hash:true,
        //minfy:true//是否压缩
    })
],
```
> html中用模板语法动态引入插件title属性
```html
<title><%=htmlWebpackPlugin.option.title %></title>
```

 ## 编译webpack项目中的html文件





