import mongoose from "mongoose";

const schema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  requirements: [String],
  salaryMin: Number,
  salaryMax: Number,
  currency: { type: String, default: "INR" },
  location: String,
  type: { type: String, enum: ["full-time","part-time","internship","contract","remote","hybrid"], default: "full-time" },
  deadline: Date,
  applyMethod: { type: String, enum: ["direct","external","email"], default: "direct" },
  externalUrl: String,
  contactEmail: String,
  skills: [String],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

schema.index({ title: "text", description: "text", requirements: "text", skills: "text", location: "text" });

export default mongoose.model("Job", schema);
