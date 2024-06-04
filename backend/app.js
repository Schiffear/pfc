require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

const PORT = 3002;
const JWT_SECRET ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIyMDAzMTEyNDkzIiwibmFtZS6IkFuZHJlYXMgQm9kaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.EloTxt_OYHqionAS_7Vg1PZJjtZ0_rdGJNjN_Lrh9MY';
const MONGO_URI ='mongodb+srv://andreas:andreas@cluster0.fwvpnpz.mongodb.net/';

console.log('PORT:', PORT);
console.log('JWT_SECRET:', JWT_SECRET);
console.log('MONGO_URI:', MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
