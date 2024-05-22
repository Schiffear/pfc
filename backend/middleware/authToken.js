const jwt = require('jsonwebtoken');

const authenticateTokenForSSE = (req, res, next) => {
  const token = req.query.token;
  console.log("Received token:", token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateTokenForSSE };
