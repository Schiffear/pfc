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

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

console.log('PORT:', PORT);
console.log('JWT_SECRET:', JWT_SECRET);
console.log('MONGO_URI:', MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
