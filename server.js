const app = require('./app')
require('dotenv').config();

const mongoose = require('mongoose');

const PORT = process.env.PORT || 8000;

mongoose.connect('mongodb://localhost:27017/htok', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( result => console.log('Connection established'))
.catch(err => console.log('error', err))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})