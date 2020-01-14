const webpack =require("webpack")//引入webpack
const path =require("path")//引入path
const glob =  require('glob')//用来打包多个文件
const DIST_PATH=path.resolve(__dirname,'../dist')//打包到的文件路径
const ENTRY_PATH=path.resolve(__dirname,'../src')//需要打包的入口路径

var entryFiles={}
let files = glob.sync(path.join(ENTRY_PATH+'/**/*.js'))//用正则匹配所有目录下的js文件
console.log('打包文件',files)

files.forEach((file)=>{
    let subkey = file.match(/src\/(\S*)\.js/)[1]//文件名
    entryFiles[subkey]=file
})

console.log(entryFiles)
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
        filename:'[name].[chunkhash].js'
    },
    //模块解析
    module:{

    },
    //插件
    plugins:[

    ],
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