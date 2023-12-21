import { Schema, model } from "mongoose";

const ApplyJobSchema = new Schema({
  candidate_id: { type: Schema.Types.ObjectId, required: true },
  job_id: { type: Schema.Types.ObjectId, required: true },
  recruiter_id: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED','REJECTED'], required: true ,default:"PENDING"},
});

const ApplyJob = model("ApplyJob", ApplyJobSchema);
export default ApplyJob;
