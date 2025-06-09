const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('Authorization header:', req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; // set user info for next handler
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
