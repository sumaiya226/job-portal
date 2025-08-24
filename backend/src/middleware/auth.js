import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try{
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.split(" ")[1] : null;
    if(!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("_id name email role");
    if(!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  }catch(e){
    e.status = 401;
    next(e);
  }
};

export const permit = (...roles) => (req, res, next) => {
  if(!req.user) return res.status(401).json({ error: "Unauthorized" });
  if(!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
  next();
};
