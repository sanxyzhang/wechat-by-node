'use strict';

var sha1=require('sha1');
var Wechat=require('./wechat');
var util=require('./util');

//拼装buffer的xml数据
var getRawBody=require('raw-body');

module.exports=(opts,handler)=>{
    var wechat=new Wechat(opts);
    
    return function *(next){
        var that=this;
        console.log(this.query);
        var token=opts.token;
        var signature=this.query.signature;
        var nonce=this.query.nonce;
        var timestamp=this.query.timestamp;
        var echostr=this.query.echostr;
        var str=[token,timestamp,nonce].sort().join('');
        var sha=sha1(str);
      //  console.log(sha);
      if(this.method==="GET"){
        if(sha===signature){
            this.body=echostr+'';
        }
        else{
            this.body='wrong';
        }
      }
      else if(this.method==="POST"){
          if(sha!==signature){
            this.body='wrong';  
            return false;
          }
          var data=yield getRawBody(this.req,{
              length:this.length,
              limit:'1mb',
              encoding:this.charset
          })
          var content=yield util.parseXMLAsync(data);
          
          var message=util.formatMessage(content.xml);
          console.log("POST过来的data数据"+message);
          //console.log(data.toString());
          this.weixin=(message);
        //   if(message.MsgType==='event'){
        //       if(message.Event=='subscribe'){
        //           var now=new Date().getTime();
        //           that.status=200;
        //           that.type='application/xml';
        //           that.body=xml;
        //       }
        //   }
        yield handler.call(this,next);
        wechat.reply.call(this);
      }
        
    }
}
