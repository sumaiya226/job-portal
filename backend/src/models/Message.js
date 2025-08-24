import mongoose from "mongoose";
const schema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true }
}, { timestamps: true });

schema.index({ job:1, applicant:1, createdAt:1 });

export default mongoose.model("Message", schema);
