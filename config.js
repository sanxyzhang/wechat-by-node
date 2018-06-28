'use strict';

var Koa=require('koa');
var path=require('path');
const util = require("./libs/util");
var wechat_file=path.join(__dirname,'./config/wechat.json');
var config={
    wechat:{
        appID:'wx291a0eaa9e60460d',
        appSecret:'22f77c7a1ee2da16ab0e2efbcc5695d5',
        token:'zhangyue',
       // access_token:'',
       // expires_in:'',
        getAccessToken:function(){
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function(data){
            //
            console.log("kkkkKKK"+ data.access_token);
            var data=JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        }
    }
}

module.exports=config;