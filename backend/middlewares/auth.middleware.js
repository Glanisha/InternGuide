import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token; // Get token from handshake auth
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user data to socket
    next();
  } catch (error) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
