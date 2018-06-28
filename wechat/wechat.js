'use strict';

var sha1=require('sha1');
var Promise=require('bluebird');
var request = require("request");
var util=require("./util");
request = Promise.promisifyAll(request);

var prefix='https://api.weixin.qq.com/cgi-bin/';
var api={
    accessToken:prefix+'token?grant_type=client_credential'
}
function Wechat(opts){
    var that=this;
    this.appID=opts.appID;
    this.appSecret=opts.appSecret;
    this.getAccessToken=opts.getAccessToken;
    this.saveAccessToken=opts.saveAccessToken;
    
    this.getAccessToken()
    .then(function(data){
        try{
            //data=this.data;
            data=JSON.parse(data);
           // data=JSON.stringify(data);
            console.log("AAA"+data.access_token);
        }
        catch(e){
            return that.updateAccessToken();
        }
        if(that.isValidAccessToken(data)){
            return Promise.resolve(data);
        }
           
        else {
            return that.updateAccessToken();
        }
    })
    .then(function(data){
        
        console.log("LAST"+data);
        data.access_token=data.access_token;
        data.expires_in=data.expires_in;      
        that.saveAccessToken(data);
    })
}
Wechat.prototype.isValidAccessToken=function(data){
   // console.log("VAILD");
    var access_token=data.access_token;
    var expires_in=data.expires_in;
   // console.log("TTTT"+access_token);
    if(!data||!data.access_token||!data.expires_in){
       // console.log("false");
        return false;      
    }
   
   // var newdata=JSON.stringify(data);
   
    var now=(new Date().getTime());
    if(now<expires_in){
        return true;
       // console.log("OK");
    }
    else{
        return false;
     }
}
Wechat.prototype.updateAccessToken=function(){
    var appID=this.appID;
    var appSecret=this.appSecret;
    var url=api.accessToken+'&appid='+appID+'&secret='+appSecret;
    return new Promise(function(resolve,reject){
        request({url:url,json:true,headers: {"content-type": "application/json"}},function(error,response,body)
        {
            if(!error&&response.statusCode==200){
            var data=response.body;
            console.log(data);
            var access_token=body.access_token;
            var now=(new Date().getTime());
            var expires_in=now+(body.expires_in-20)*1000;
            data.expires_in=expires_in; 
            console.log(data.expires_in);          
            resolve(data);
            }
         });
        // request({url:url,json:true}).then(function(response){
        //     var data=response[1];
        //     var now=(new Date().getTime());
        //     var expires_in=now+(data.expires_in-20)*1000;
        //     data.expires_in=expires_in;
        //     resolve(data);
        // }
       
    })
}
Wechat.prototype.reply=function(){
    var content=this.body;
    console.log("THIS BODY是什么"+content);
    var message=this.weixin;//是用户post到服务器上的数据
    var xml=util.tpl(content,message)

    this.status=200;
    this.type='application/xml';
    this.body=xml;
}
module.exports=Wechat;