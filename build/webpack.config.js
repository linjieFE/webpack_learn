const webpack =require("webpack")//引入webpack
const path =require("path")//引入path
const glob =  require('glob')//用来打包多个文件
const htmlWebpackPlugin =  require('html-webpack-plugin')//引用html插件
const DIST_PATH=path.resolve(__dirname,'../dist')//打包到的文件路径
const ENTRY_PATH=path.resolve(__dirname,'../src')//需要打包的入口路径

var entryFiles={}

//[\s] --- 表示，只要了出现空白就匹配
//[\S] --- 表示，只要了非空白就匹配
let files = glob.sync(path.join(ENTRY_PATH+'/**/*.js'))//用正则匹配所有目录下的js文件
files.forEach((file)=>{
    let subkey = file.match(/src\/(\S*)\.js/)[1]//文件名 \S* 匹配非空白字符串
    entryFiles[subkey]=file
})

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

module.exports={
    //入口
    // entry: ENTRY_PATH+'/index.js',//绝对路径 
    // entry:{
    //     index:ENTRY_PATH+'/index.js',
    //     test:ENTRY_PATH+'/test.js'
    // },
    entry:entryFiles,
    //编译输出打包
    output:{
        path:DIST_PATH,
        filename:'[name].[chunkhash:5].js'
    },
    //模块解析
    module:{

    },
    //插件
    // plugins:[
    //     new htmlWebpackPlugin({
    //         filename:DIST_PATH+'/index.html',//文件目录/文件名.html
    //         title:'测试',//html title 
    //         template:path.resolve(__dirname,'../index.html'),//模板文件
    //         inject:true,//默认true =>代表打包出来的script标签位于html底部
    //         hash:true
    //     })
    // ],
    plugins:pluginsAll,
    //开发服务器
    devServer:{
        hot:true,//是否热更新
        contentBase:DIST_PATH,//热更内存目录
        port:8088,//服务端口
        host:'0.0.0.0',//host地址
        historyApiFallback:true,//友好处理404
        open:true,//启动时自动打工一个页面
        useLocalIp:false,//是否在打包的时候用自己的IP，
        https:false,//是否用https
        proxy:{//处理跨域(可利用正则等区配) 
            'api':'http://localhost:3000'   //另一个端口
        }
    }
}