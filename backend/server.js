require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = 3002;
const MONGO_URI ='mongodb+srv://andreas:andreas@cluster0.fwvpnpz.mongodb.net/';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
