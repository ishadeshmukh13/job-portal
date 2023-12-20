import { Schema, model } from "mongoose";

const ApplyJobSchema = new Schema({
  candidate_id: { type: Schema.Types.ObjectId, required: true },
  job_id: { type: Schema.Types.ObjectId, required: true },
});

const ApplyJob = model("ApplyJob", ApplyJobSchema);
export default ApplyJob;
