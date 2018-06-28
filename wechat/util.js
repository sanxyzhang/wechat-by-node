'use strict'

var xml2js=require('xml2js');
var Promise=require('bluebird');
var tpl=require('./tpl');
var fs=require('fs');
exports.parseXMLAsync=function(xml){
    return new Promise(function(resolve,reject){
        xml2js.parseString(xml,{trim:true},function(err,content){
            if(err) reject(err);
            else resolve(content);
        })
    })
}
function formatMessage(result){
    var message={};
    if(typeof result==='object'){
        var keys=Object.keys(result);
        for(var i=0;i<keys.length;i++){
            var item=result[keys[i]];
            var key=keys[i];

            if(!(item instanceof Array)||item.length===0){
                continue;
            }
            if(item.length===1){
                var val=item[0];
                if(typeof val==="object"){
                    message[key]=formatMessage(val);
                }
                else{
                    message[key]=(val||'').trim();
                }
            }
            else{
                message[key]=[];
                for(var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}

exports.formatMessage=formatMessage;

exports.tpl=function(content,message){
    let info = {};
    let type = "text";
    let fromUser = message.FromUserName;
    let toUser = message.ToUserName;
    console.log(content);
    if (Array.isArray(content)) { //图文消息
        type = "news";
    }
    content = content || {}
    info.content = content;
   type = content.type || type;
    
    info.createTime = new Date().getTime();
    info.msgType = type;
    info.toUser = fromUser;
    info.fromUser = toUser;
    return tpl.compiled(info);
}

exports.readFileAsync=function(fpath,encoding){
    return new Promise(function(resolve,reject){
        fs.readFile(fpath,encoding,function(err,content){
            if(err) reject(err);
            else resolve(content);
        })
    })
}

exports.writeFileAsync=function(fpath,content){
    return new Promise(function(resolve,reject){
        fs.writeFile(fpath,content,function(err){
            if(err) reject(err);
            else resolve();
        })
    })
}