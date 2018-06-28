'use strict'
exports.reply=function* (next){
    var message=this.weixin;
    console.log(message);
    console.log(message.MsyType);
    if(message.MsgType==='event'){
        if(message.Event==='subscribe'){
            if(message.EventKey){
                console.log('扫码进来'+ message.EventKey+''+message.ticket);

            }
            this.body='欢迎订阅\r\n';
        }
        else if(message.Event==='unsubscribe'){
            console.log('无情取关');
            this.body=' ';
        }
        else if(message.Event==='LOCATION'){
            this.body='您上报的位置是:'+message.Latitude+'/'+
            message.Lonitude+'-'+message.Precision;
        }
        else if(message.Event==='CLICK'){
            this.body='您点击了菜单：'+message.EventKey;
        }
        else if(message.Event==='SCAN'){
            console.log('关注后扫描二维码'+message.EventKey+''+message.Ticket);
            this.body='看到你扫了一下哦';
        }
        else if(message.Event==='VIEW'){
            this.body='你点击了菜单中的链接：'+message.EventKey;
        }      
    }
    else if(message.MsgType==='text'){
        var content=message.Content;
        var reply='你说的太复杂了';
        if(content==='1'){
            reply='1111';
        }
        if(content==='3'){
            reply='3333';
        }
        if(content==='2'){
            reply='2222';
        }
       this.body=reply;
    }
    yield next;
}