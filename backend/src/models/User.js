import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["seeker","employer","admin"], default: "seeker" },
  skills: [String],
  resumeUrl: String
}, { timestamps: true });

schema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

schema.methods.compare = function(pw){ return bcrypt.compare(pw, this.password); };

export default mongoose.model("User", schema);
