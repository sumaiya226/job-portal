import { Router } from "express";
import { auth } from "../middleware/auth.js";
import Message from "../models/Message.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const r = Router();

r.get("/thread", auth, async (req,res,next)=>{
  try{
    const { jobId, applicantId } = req.query;
    if(!jobId || !applicantId) return res.status(400).json({ error: "jobId and applicantId required" });
    const job = await Job.findById(jobId);
    if(!job) return res.status(404).json({ error: "Job not found" });
    const app = await Application.findOne({ job: jobId, applicant: applicantId });
    if(!app) return res.status(404).json({ error: "Application not found" });

    const isEmployer = String(req.user._id) === String(job.postedBy);
    const isApplicant = String(req.user._id) === String(applicantId);
    if(!isEmployer && !isApplicant) return res.status(403).json({ error: "Forbidden" });

    const msgs = await Message.find({ job: jobId, applicant: applicantId }).sort({ createdAt: 1 });
    res.json({ items: msgs, chatOpen: app.chatOpen, status: app.status });
  }catch(e){ next(e); }
});

r.post("/send", auth, async (req,res,next)=>{
  try{
    const { jobId, applicantId, text } = req.body;
    if(!text) return res.status(400).json({ error: "text required" });
    const job = await Job.findById(jobId);
    if(!job) return res.status(404).json({ error: "Job not found" });
    const app = await Application.findOne({ job: jobId, applicant: applicantId });
    if(!app) return res.status(404).json({ error: "Application not found" });

    const isEmployer = String(req.user._id) === String(job.postedBy);
    const isApplicant = String(req.user._id) === String(applicantId);
    if(!isEmployer && !isApplicant) return res.status(403).json({ error: "Forbidden" });

    if(isApplicant && !app.chatOpen){
      return res.status(403).json({ error: "Chat not available. Wait for employer to contact you or be shortlisted." });
    }

    const m = await Message.create({ job: jobId, employer: job.postedBy, applicant: applicantId, sender: req.user._id, text });
    if(isEmployer && !app.chatOpen){
      app.chatOpen = true; // employer initiates chat
      await app.save();
    }
    res.json({ message: m, chatOpen: app.chatOpen });
  }catch(e){ next(e); }
});

export default r;
