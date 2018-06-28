'use strict';

var Koa=require('koa');
var path=require('path');
var util=require('./libs/util');
var wechat=require('./wechat/g');
var weixin=require('./weixin');
var wechat_file=path.join(__dirname,'./config/wechat.json');
var config=require('./config');
var app=new Koa();

app.use(wechat(config.wechat,weixin.reply));

app.listen(443);
console.log('Listening:443');