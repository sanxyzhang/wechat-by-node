const Promise=require("bluebird");
const promise=new Promise((resolve,reject)=>{
    const value=Math.random();
    if(value>0.5){
        resolve(value);
    }
    else{
        reject(`Invalid value ${value}`);
    }
});
promise.then(console.log).catch(console.error);

Promise.resolve([1,2,3])
.spread((v1,v2,v3)=>console.log(v1,v2,v3));