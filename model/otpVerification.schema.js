import {Schema,model} from 'mongoose';

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userType:{type:String,required:true},
  expiresAt: { type: Date, required: true },
});

const OTPModel = model('OTP', otpSchema);

export default OTPModel;