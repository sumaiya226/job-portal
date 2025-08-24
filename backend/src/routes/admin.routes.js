import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const r = Router();
r.get("/stats", auth, permit("admin","employer","seeker"), async (req,res,next)=>{
  try{
    const [users, jobs, applications] = await Promise.all([
      User.countDocuments({}), Job.countDocuments({}), Application.countDocuments({})
    ]);
    res.json({ users, jobs, applications });
  }catch(e){ next(e); }
});

export default r;
