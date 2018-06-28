const debug = require('debug')('rawbody')
module.exports = function (req, res, next) {
  let body = [];
  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    req.body = Buffer.concat(body).toString();
    debug('req.body:%s', req.body)
    next()
  })
}
