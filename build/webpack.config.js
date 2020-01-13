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