import { Router } from "express";
import { auth, permit } from "../middleware/auth.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const r = Router();

// Create application
r.post("/", auth, permit("seeker","admin"), async (req,res,next)=>{
  try{
    const { jobId, coverLetter, resumeUrl } = req.body;
    const job = await Job.findById(jobId);
    if(!job || !job.active) return res.status(400).json({ error: "Job unavailable" });
    const app = await Application.findOneAndUpdate(
      { job: jobId, applicant: req.user._id },
      { $setOnInsert: { job: jobId, applicant: req.user._id }, coverLetter, resumeUrl, status: "applied" },
      { upsert: true, new: true }
    );
    res.json({ application: app });
  }catch(e){ next(e); }
});

// My applications (seeker)
r.get("/mine", auth, permit("seeker","admin"), async (req,res,next)=>{
  try{
    const items = await Application.find({ applicant: req.user._id })
      .populate({ path: "job", select: "title location type postedBy active" })
      .sort({ createdAt: -1 });
    res.json({ items });
  }catch(e){ next(e); }
});

// Applicants for a job (employer)
r.get("/for-job/:jobId", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const job = await Job.findById(req.params.jobId);
    if(!job) return res.status(404).json({ error: "Job not found" });
    if(String(job.postedBy) !== String(req.user._id) && req.user.role!=="admin")
      return res.status(403).json({ error: "Forbidden" });
    const items = await Application.find({ job: job._id })
      .populate("applicant","name email skills resumeUrl")
      .sort({ createdAt: -1 });
    res.json({ items });
  }catch(e){ next(e); }
});

// Update status (employer)
r.put("/:id/status", auth, permit("employer","admin"), async (req,res,next)=>{
  try{
    const { status } = req.body; // shortlisted | selected | rejected | under_review
    const app = await Application.findById(req.params.id).populate("job","postedBy");
    if(!app) return res.status(404).json({ error: "Not found" });
    if(String(app.job.postedBy) !== String(req.user._id) && req.user.role!=="admin")
      return res.status(403).json({ error: "Forbidden" });

    app.status = status;
    if(status==="shortlisted" || status==="selected"){
      app.chatOpen = true;
    } else if(status==="rejected"){
      app.chatOpen = false;
    }
    await app.save();
    res.json({ application: app });
  }catch(e){ next(e); }
});

export default r;
