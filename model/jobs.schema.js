import { Schema, model } from "mongoose";

const JobsSchema = new Schema({
  job_type: { type: String, enum: ["PART_TIME", "FULL_TIME"], required: true },
  recruiter_id: { type: Schema.Types.ObjectId, required: true },
  total_application: { type: Number, required: true },
  no_of_jobs: { type: Number, required: true },
  experience_required: { type: Number, required: true },
  skills: { type: Array, required: true },
  job_title: { type: String, required: true },
  working_hours: { type: Number, required: true },
  created_at: { type: Schema.Types.Date, default: new Date() },
  location: { type: String, required: true },
  company_name: { type: String, required: true },
  workspace: {
    type: String,
    enum: ["WORK_FROM_HOME", "WORK_FROM_OFFICE", "HYBRID"],
    required: true,
  },
  active:{type: Boolean, default: "true" }
});

const Job = model("job", JobsSchema);
export default Job;
