import { Schema, model } from "mongoose";

const CandidateSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile_no: { type: String, required: true },
  skills: { type: String, required: true },
  experience: { type: String, required: true },
  city: { type: String, required: true },
  user_type: { type: String, default: "CANDIDATE" },
  created_at: { type: Schema.Types.Date, default: new Date() },
  profile:{ type: String},
  verified:{type:Boolean,default:false}
});

const Candidate = model("candidate", CandidateSchema);
export default Candidate;
