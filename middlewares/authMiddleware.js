const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_super_secret_key";


// Middleware to check if user is authenticated
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid Token" });
  }
};

// Middleware to check if user has a specific role
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ error: "Access Denied: Unauthorized Role" });
  next();
};

module.exports = { authenticateToken, authorizeRole };
