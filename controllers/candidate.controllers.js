import Candidate from "../model/candidate.schema.js";
import ApplyJob from "../model/applyJob.schema.js";
import Recruiter from "../model/recruiter.schema.js";
import Job from "../model/jobs.schema.js";
import pkg from "nodemailer";
import fsPromises from "fs/promises";
import fs from "fs";
import { generateToken } from "../helper/jwtutlis.js";
import path from "path";
const nodemailer = pkg;
import { hashPassword, comparePasswords } from "../helper/passwordUtils.js";

export default class CandidateController {

  static async signUp(req, res) {
    try {
      const reqData = req.body;
      const testAccount = await nodemailer.createTestAccount();
      const transporter = await nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "ishadeshmukh000@gmail.com",
          pass: "lpqh euqh vthv yivh",
        },
      });
      const result = await Candidate.find({
        email: reqData.email,
      });
      if (result && Object.keys(result).length > 0) {
        if (req?.file?.path) {
          fs.unlinkSync(req?.file?.path);
        }
        res.status(409).json({
          status: false,
          message: "email already exits",
        });
      } else {
        const password = await hashPassword(req.body.password);
        if (req?.file?.path) {
          await Candidate.create({
            ...reqData,
            profile: `${new Date().toISOString().slice(0, -8)}-${
              req.file.originalname
            }`,
            password: password,
          });
        } else {
          await Candidate.create({
            ...reqData,
            password: password,
          });
        }
        const info = await transporter.sendMail({
          from: {
            name: "job_portal",
            address: "ishadeshmukh000@gmail.com",
          },
          to: [reqData.email],
          subject: "Hello ✔",
          text: `Hello, Your account successfully created in on the job portal side`,
        });
        transporter.sendMail(info);
        res.status(201).json({
          status: true,
          message: "candidate created account in successfully",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }

  static async signIn(req, res) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = await nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "ishadeshmukh000@gmail.com",
          pass: "lpqh euqh vthv yivh",
        },
      });

      const reqData = req.body;
      let result = await Candidate.findOne({
        email: reqData.email,
      });

      const checkPassword = await comparePasswords(
        req.body.password,
        result.password
      );
      if (checkPassword) {
        const info = await transporter.sendMail({
          from: {
            name: "job_portal",
            address: "ishadeshmukh000@gmail.com",
          },
          to: [reqData.email],
          subject: "Hello ✔",
          text: `Hello, Your account successfully logged in on the job portal side`,
        });
        await transporter.sendMail(info);
        const currentModulePath = new URL(import.meta.url).pathname;
        const currentModuleDir = path.dirname(currentModulePath);

        if (result.profile) {
          const imagePath = path.join(
            currentModuleDir,
            "../uploads/candidate",
            result.profile
          );
          await fsPromises.access(imagePath, fsPromises.constants.F_OK);

          const imageBuffer = await fsPromises.readFile(imagePath);

          const imageBase64 = imageBuffer.toString("base64");

          const data = {
            ...result._doc,
            token: generateToken(result._id, "candidate"),
            profile: `data:image/jpeg;base64,${imageBase64}`,
          };
        
          res.status(200).json({
            status: true,
            message: "candidate logged in successfully",
            data: data,
            info,
          });
        } else {
          result = {  ...result._doc, token: generateToken(result._id, "candidate") };
          res.status(200).json({
            status: true,
            message: "candidate logged in successfully",
            data: result,
            info,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "please provide right email or password",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }

  static async listOfCandidate(req, res) {
    try {
      const result = await Recruiter.findOne({
        _id: req.userId,
      });

      if (result && Object.keys(result).length > 0) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 3;
        let skip = (page - 1) * limit;
        const allCandidates = await Candidate.find().skip(skip).limit(limit);
        res.status(200).json({
          status: true,
          message: "list of candidate user",
          data: { list: allCandidates, pageNumber: page, limit: limit },
        });
      } else {
        res.status(400).json({
          status: false,
          message: "please provide right token",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }

  static async applyjob(req, res) {
    try {
      const result = await Candidate.findOne({
        _id: req?.userId,
      });
      if (result && Object.keys(result)) {
        const checkForm = await ApplyJob.findOne({
          candidate_id: req?.userId,
          job_id: req?.body?.job_id,
        });
        const data = await Job.findOne({
          _id: req?.body?.job_id,
        });
        const AppliedJobs = await ApplyJob.find({
          _id: req.body.job_id,
        });
        const countOfAppliedJobs = AppliedJobs.length;
        if (checkForm && Object.keys(checkForm).length > 0) {
          res.status(200).json({
            status: true,
            message: "you already applied this job  !!!",
          });
        } else if (data && Object.keys(data).length > 0) {
          if (data.total_application > countOfAppliedJobs) {
            await ApplyJob.create({
              ...req.body,
              candidate_id: req.userId,
              recruiter_id:data.recruiter_id
            });
            res.status(200).json({
              status: true,
              message: "Applied job successfully !!!",
            });
          } else {
            res.status(200).json({
              status: true,
              message: "You can not apply this job because all form filled.",
            });
          }
        } else {
          res.status(400).json({
            status: false,
            message: "please provide right job_id.",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "please provide right token.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }

  static async applyJobList(req, res) {
    try {
      const objectId = req?.userId;
      const candidateData = await Candidate.find({
        _id: objectId,
      });
      const applyJobData = await ApplyJob.find({
        candidate_id: objectId,
      });
      if (candidateData.length === 0) {
        res.status(400).json({
          status: false,
          message: "please provide right token.",
        });
      } else if (candidateData && candidateData.length > 0) {
        if (applyJobData && Object.keys(applyJobData).length > 0) {
          const jobIds = applyJobData.map((job) => job.job_id);
          const jobData = await Job.find({
            _id: { $in: jobIds },
          });
          const mergedData = applyJobData.map((applyJob) => {
            const correspondingJob = jobData.find(
              (job) => job._id.toString() === applyJob.job_id.toString()
            );
            return { ...applyJob.toObject(), jobData: correspondingJob };
          });
          res.status(200).json({
            status: true,
            message: "list of your applied jobs.",
            data: mergedData,
          });
        } else {
          res.status(500).json({
            status: false,
            message: "You have not applied for any job.",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "internal server error",
        error: error.message,
      });
    }
  }

}
