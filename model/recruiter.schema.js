import { Schema, model } from "mongoose";

const RecruiterSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile_no: { type: String, required: true },
  city: { type: String, required: true },
  company_name: { type: String, required: true },
  created_at: { type: Schema.Types.Date, default: new Date()},
  user_type: { type: String, default: "RECRUITER" },
  profile:{ type: String},
});

const Recruiter = model("Recruiter", RecruiterSchema);
export default Recruiter;
