const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(morgan('common'))

app.use(bodyParser.json());

app.use(require('./Routes'))

app.use(cors());

module.exports = app 