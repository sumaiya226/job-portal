import mongoose from "mongoose";
const schema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: String,
  resumeUrl: String,
  status: { type: String, enum: ["applied","under_review","shortlisted","selected","rejected"], default: "applied" },
  chatOpen: { type: Boolean, default: false }
}, { timestamps: true });

schema.index({ job:1, applicant:1 }, { unique: true });

export default mongoose.model("Application", schema);
