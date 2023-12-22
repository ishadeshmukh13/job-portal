import { verifyToken as jwtVerifyToken } from "../helper/jwtutlis.js";

const verfiToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorised: No token provided" });
  }
  try {
    const decoded = jwtVerifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorised: Invaild token" });
  }
};

export default verfiToken;
