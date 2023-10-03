const { request } = require('express');
const express = require('express');
const path = require('path');
const route = express.Router();
var cors = require('cors');

const allowedOrigins = ['*'];

route.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

route.use(cors({
  origin: function(origin, callback){
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));

route.use('/user', require('./User/order.route'))
route.use('/video', require('./Video/order.route'))
route.use('/upload', require('./Upload/order.route'))
route.use('/post', require('./Post/order.route'))
route.use('/comment', require('./Comment/order.route'))

route.get("/image/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const path1 = path.dirname(__dirname) + "/image/" + fileName;

  res.sendFile(path1);
});

module.exports = route