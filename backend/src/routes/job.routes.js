import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

const r = Router();

// Public search
r.get("/", async (req,res,next)=>{
  try{
    const { q, type, location, min, max, page=1, limit=10 } = req.query;
    const filter = { active: true };
    if (q) filter.$text = { $search: q };
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (min || max) {
      filter.$and = [];
      if (min) filter.$and.push({ salaryMin: { $gte: Number(min) } });
      if (max) filter.$and.push({ salaryMax: { $lte: Number(max) } });
    }
    const skip = (Number(page)-1)*Number(limit);
    const [items, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
  }catch(e){ next(e); }
});

// Create job
r.post("/", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.json({ job, message: "Job posted successfully." });
  }catch(e){ next(e); }
});

// Employer jobs with stats
r.get("/mine-with-stats", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    const jobIds = jobs.map(j=> j._id);
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", total: { $sum: 1 },
        shortlisted: { $sum: { $cond: [{ $eq: ["$status","shortlisted"] }, 1, 0] } },
        selected: { $sum: { $cond: [{ $eq: ["$status","selected"] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ["$status","rejected"] }, 1, 0] } },
      } }
    ]);
    const map = Object.fromEntries(counts.map(c=> [String(c._id), c]));
    const enriched = jobs.map(j=> ({ ...j.toObject(), stats: map[String(j._id)] || { total:0, shortlisted:0, selected:0, rejected:0 } }));
    res.json({ items: enriched });
  }catch(e){ next(e); }
});

// Single job
r.get("/:id", async (req,res,next)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: "Not found" });
    res.json({ job });
  }catch(e){ next(e); }
});

r.put("/:id", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: "Not found" });
    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  }catch(e){ next(e); }
});

// Close opening
r.post("/:id/close", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: "Not found" });
    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    job.active = false;
    await job.save();
    res.json({ job, message: "Opening closed." });
  }catch(e){ next(e); }
});

r.delete("/:id", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: "Not found" });
    if (String(job.postedBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    await job.deleteOne();
    res.json({ ok: true });
  }catch(e){ next(e); }
});

export default r;
