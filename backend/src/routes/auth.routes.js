import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const r = Router();

const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

r.post("/register", async (req,res,next)=>{
  try{
    const { name, email, password, role } = req.body;
    const assignRole = role && ["seeker","employer"].includes(role) ? role : "seeker";
    const u = await User.create({ name, email, password, role: assignRole });
    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  }catch(e){ next(e); }
});

r.post("/login", async (req,res,next)=>{
  try{
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if(!u || !(await u.compare(password))) return res.status(401).json({ error: "Invalid credentials" });
    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  }catch(e){ next(e); }
});

r.get("/me", auth, async (req,res)=>{
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

export default r;
