## Webpack4主要优势
> webpack-dev-server 搭建本地环境，进行热更新
> 预处理（less,sass,转换es6,转换JSX,typescript...）
> 图片添加hash 方便线上CDN 缓存、压缩
> 自动处理css3属性前缀补全
> 单文件多文件打包
> 模块化开发\打包
> js压缩，按需加载

## webpack4
* 增加了`mode`属性 `development` 或 `production`
* 多进程/多实例构建 -`happyPack` 
* 分包-`Externals`--将react 基础包通过CDN引入
* 缓存 / 不用重复解析
* 缩小构建目标
* 构建时间降低了60% ~ 80%
* v8的优化（for of 替代 forEach...）
* 默认使用更快的md4 hash算法


```bash
"script":{
    "dev":"webpack --mode development",
    "build":"webpack --mode production"
} 
```
通过mode 可以轻松设置打包环境

> `Tree-shaking`  打包前自动清除无用的文件引用。。。
## 全局安装webpack4

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

## 初始化项目 `npm init` 生成一个 `package.json`
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

webpack 默认打包 `src/index.js` 生成`dist`文件，如src下有`index.js` ,终端下直接执行`webpack`生成`dist`打包
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
> step1 新建 `build` 文件夹=>`webpack.config.js`

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

> 配置`webpack.config.js`
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
> 配置`package.json`

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
 ## 编译webpack项目中的html文件
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

> 插件管理 webpack.config.js(例举打包page文件夹下所有html)

```javascript
var pluginsAll=[]//放所有的插件
let pages = glob.sync(path.join(ENTRY_PATH+'/pages/**/*.html'))//用正则匹配所有目录下的js文件
console.log('打印页面：',pages)

pages.forEach((page,index)=>{
    let name = page.match(/\/src\/pages\/(\S*)\.html/)[1]//文件名 \S* 匹配非空白字符串
    let plugPage= new htmlWebpackPlugin({
        filename:path.join(DIST_PATH,name+'.html'),//文件目录/文件名.html
        title:'测试'+index,//html title 
        template:ENTRY_PATH+'/pages/'+name+'.html',//模板文件
        inject:true,//默认true =>代表打包出来的script标签位于html底部
        hash:true,
        //minfy:true,//是否压缩
        chunks:[name]//相应的文件名
    })
    pluginsAll.push(plugPage)
})
```
 ## vue demo `webpack-demo/hello_vue `  升级webpack4
> step1 安装vue-cli 脚手架 `sudo npm install vue-cli -g`
> step2 下载vue工程的模板 `vue init webpack hello_vue` 
  这时package.json 中的webpack版本应该是3
> step3 升级 `cd hello_vue` 终端 `cnpm install webpack@^4 -D`
> 跟据报错提示 
  * 升级最新版本`webpack-dev-server` 终端 `cnpm install webpack-dev-server@latest -D`
  * 升级最新版本`webpack-cli` 终端 `cnpm install webpack-cli@latest -D`
  * 升级最新版本`extract-text-webpack-plugin` 终端 `cnpm install extract-text-webpack-plugin@next -D`
  * 升级最新版本`mini-css-extract-plugin` 终端 `cnpm install mini-css-extract-plugin@latest -D`
  * 升级最新版本`html-webpack-plugin` 终端 `cnpm install html-webpack-plugin@next -D`
  `eslint-loader` `vue-loader` `cnpm install file-loader@latest -D`...

> webpack.base.conf.js
  . [参考官方文档](https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required)
  . Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 `VueLoaderPlugin`的
  解决方案
  ```
  //项部引入插件
  const VueLoaderPlugin = require('vue-loader/lib/plugin');

  module.exports = {

  //...
  plugins:[
    new VueLoaderPlugin()
  ],
  //...

  ```
  >到这一步的的webpack4 的vue 项目启动起来了
  打开后发现图片logo不能正常显示，检查元素src路径` src= "[object Module]" `

  ### 解决方法

  > file-loader 的版本是 4.3.0 及以上，则需要在 webpack.base.config.js 中手动配置属性 esModule 

  ```
  module: {
    rules: [
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                esModule: false, // 默认值是 true，需要手动改成 false
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        },
    ]
  }
 ```

 >`npm run build`问题
 ```
 Error: webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
 ```
 optimization可以实现很多功能，最常见的功能是：

three shaking 只支持ES Module模块的引入，删除没有引用的模块打包
Code Splitting 拆分代码，提高执行效率和用户体验
splitChunks是用来设置代码如何打包和分割的，现就webpack官网提供的默认参数详细解释一下每个参数配置的含义以及使用场景。
[官网链接](https://webpack.js.org/plugins/split-chunks-plugin/)

> webpack.prod.conf.js `CommonsChunkPlugin` 替换成 `config.optimization.splitChunks ` 
* webpack.prod.conf.js 中 注释掉引用 `CommonsChunkPlugin`
 ```
 optimization: {
    /** webpack中实现代码分割的两种方式：
    * 1.同步代码：只需要在webpack配置文件总做optimization的配置即可
    * 2.异步代码(import)：异步代码，无需做任何配置，会自动进行代码分割，放置到新的文件中
    */
    splitChunks: {
      chunks: 'async', //async异步代码分割 initial同步代码分割 all同步异步分割都开启
      minSize: 30000, //字节 引入的文件大于30kb才进行分割
      minRemainingSize: 0,
      //maxSize: 50000,  //50kb，尝试将大于50kb的文件拆分成n个50kb的文件
      minChunks: 1, //模块至少使用次数
      maxAsyncRequests: 5,    //同时加载的模块数量最多是5个，只分割出同时引入的前5个文件
      maxInitialRequests: 3,  //首页加载的时候引入的文件最多3个
      automaticNameDelimiter: '~', //缓存组和生成文件名称之间的连接符
      automaticNameMaxLength: 30,
      name: true,                  //缓存组里面的filename生效，覆盖默认命名
      cacheGroups: {//缓存组，将所有加载模块放在缓存里面一起分割打包
        vendors: {  //自定义打包模块
          test: /[\\/]node_modules[\\/]/,
          priority: -10, //优先级，先打包到哪个组里面，值越大，优先级越高
          filename: 'vendors.js',
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {//默认打包模块
          minChunks: 2,
          priority: -20,//模块嵌套引入时，判断是否复用已经被打包的模块
          reuseExistingChunk: true
        }
      }
    }
  },
  ```

  > 问题2
  ```
configuration.optimization.splitChunks has an unknown property 'minRemainingSize'. These properties are valid:
  ```
  说minRemainingSize是一个无效的属性。所以我这里把它注释掉了
  > 问题3
  ```
  Error: Path variable [contenthash] not implemented in this context: static/css/[name].[contenthash].css
  ```

  > 解决方案 `webpack.prod.conf.js` 
  ```
  new ExtractTextPlugin({
      //filename: utils.assetsPath('css/[name].[contenthash].css'),
      //改成
      filename: utils.assetsPath('css/[name].[hash].css'),
  })
  ```
 * 注释掉 `chunksSortMode: 'dependency'`
  ```
 new HtmlWebpackPlugin({
    //...报错`production...Unhandled rejection Error: "dependency" is not a valid chunk sort mode
    // chunksSortMode: 'dependency' 注释掉
    //...
 })
  ```

  #### 再重新`npm run build` 打包成功 ^_^Y!

  ## webpack优化之HappyPack

  需要Webpack 能同一时间处理多个任务，发挥多核 CPU 电脑的威力，HappyPack 就能让 Webpack 做到这点，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。
  > 提示：由于HappyPack 对file-loader、url-loader 支持的不友好，所以不建议对该loader使用。

  ## 安装 HappyPack
```bash
    cnpm install -D happypack
```
> 修改你的`webpack.base.config.js` 文件

```javascript
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
//...
module: {
    rules: [
        //...
        {
            test: /\.js$/,
            //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
            loader: 'happypack/loader?id=happyBabel',
            //排除node_modules 目录下的文件
            exclude: /node_modules/
        },
        //...
    ]
},

plugins: [
    new HappyPack({
        //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    })
]
```
[webpack优化之HappyPack 实战](https://www.jianshu.com/p/b9bf995f3712)

```bash
Version: webpack 4.41.5
Time: 42044ms
Built at: 2020-01-17 17:44:03
--------- 两次打包时间对比 ------
Version: webpack 4.41.5
Time: 24459ms
Built at: 2020-01-17 20:01:03

```

安装`happypack`后打包的速度升高50%


