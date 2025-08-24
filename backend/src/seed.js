import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Job.deleteMany({}), Application.deleteMany({})]);

  const employer = await User.create({ name: "Acme HR", email: "hr@acme.dev", password: "pass123", role: "employer" });
  const seeker = await User.create({ name: "Jane Doe", email: "jane@example.com", password: "pass123", role: "seeker", skills:["React","Node","MongoDB"] });
  const admin = await User.create({ name: "Admin", email: "admin@portal.dev", password: "admin123", role: "admin" });

  const jobs = await Job.insertMany([
    { postedBy: employer._id, title: "Frontend Engineer", location: "Hyderabad", type: "full-time", description: "Build modern UIs with React and Tailwind.", skills: ["React","Tailwind","Vite"], salaryMin: 8, salaryMax: 15, currency: "LPA" },
    { postedBy: employer._id, title: "Backend Engineer", location: "Bengaluru", type: "full-time", description: "APIs with Node, Express, MongoDB.", skills: ["Node","Express","MongoDB"], salaryMin: 10, salaryMax: 18, currency: "LPA" },
    { postedBy: employer._id, title: "Data Analyst (Intern)", location: "Remote", type: "internship", description: "SQL, Python, dashboards.", skills: ["SQL","Python","Pandas"], salaryMin: 0, salaryMax: 0, currency: "stipend" }
  ]);

  // Seed one application
  await Application.create({ job: jobs[0]._id, applicant: seeker._id, coverLetter: "I love building UIs.", status: "applied", resumeUrl: "" });

  console.log("Seeded users (login):");
  console.log("- Employer:", employer.email, "/ pass123");
  console.log("- Seeker:  ", seeker.email, "/ pass123");
  console.log("- Admin:   ", admin.email, "/ admin123");

  process.exit(0);
};

run().catch(e=>{ console.error(e); process.exit(1); });
