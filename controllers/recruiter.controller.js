import Recruiter from "../model/recruiter.schema.js";
import Candidate from "../model/candidate.schema.js";
import jwt from "jsonwebtoken";
import Job from "../model/jobs.schema.js";
import mongoose from "mongoose";
import { hashPassword, comparePasswords } from "../helper/passwordUtils.js";
import pkg from "nodemailer";
import path from "path";
const nodemailer = pkg;
import fs from "fs";
import fsPromises from "fs/promises";
import { generateToken } from "../helper/jwtutlis.js";
import ApplyJob from "../model/applyJob.schema.js";

export default class RecruiterController {

  static async signUp(req, res) {
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
      const result = await Recruiter.find({
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
        const reqData = req.body;
        if (req?.file?.path) {
          await Recruiter.create({
            ...reqData,
            profile: `${new Date().toISOString().slice(0, -8)}-${
              req.file.originalname
            }`,
            password: password,
          });
        } else {
          await Recruiter.create({
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

        await transporter.sendMail(info);
        res.status(200).json({
          status: true,
          message: "recruiter created account in successfully",
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

      let result = await Recruiter.findOne({
        email: reqData.email,
      });

      if (!result) {
        return res.status(400).json({
          status: false,
          message: "Recruiter not found with the provided email",
        });
      }

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
            "../uploads/recruiter",
            result.profile
          );

          await fsPromises.access(imagePath, fsPromises.constants.F_OK);
          const imageBuffer = await fsPromises.readFile(imagePath);
          const imageBase64 = imageBuffer.toString("base64");
          const data = {
            ...result._doc,
            token: generateToken(result._id, "recruiter"),
            profile: `data:image/jpeg;base64,${imageBase64}`,
          };
          res.status(200).json({
            status: true,
            message: "Recruiter logged in successfully",
            data: data,
            info,
          });
        } else {
          result = {
            ...result._doc,
            token: generateToken(result._id, "recruiter"),
          };
          res.status(200).json({
            status: true,
            message: "Recruiter logged in successfully",
            data: result,
            info,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please provide the right email or password",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async createJob(req, res) {
    try {
      const userId = req.userId;
      const result = await Recruiter.findOne({
        _id: userId,
      });
      if (result && Object.keys(result).length > 0) {
        if (result._id == userId) {
          const reqData = req.body;
          await Job.create({
            ...reqData,
            recruiter_id: userId,
          });
          res.status(200).json({
            status: true,
            message: "created job successfully !!!",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "please provide right recruiter_id",
          });
        }
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

  static async jobList(req, res) {
    try {
      const objectId = req?.userId;

      const recruiterData = await Recruiter.find({
        _id: objectId,
      });
      const createJobData = await Job.find({
        recruiter_id: objectId,
      });
      if (recruiterData.length === 0) {
        res.status(400).json({
          status: false,
          message: "please provide right token.",
        });
      } else if (recruiterData && recruiterData.length > 0) {
        if (createJobData && Object.keys(createJobData).length > 0) {
          res.status(200).json({
            status: true,
            message: "list of your created jobs.",
            data: createJobData,
          });
        } else {
          res.status(500).json({
            status: false,
            message: "You have not created any jobs.",
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

  static async updateJobStatus(req, res) {
    try {
      const objectId = new mongoose.Types.ObjectId(req?.params?.id);
      const recruiter_id = req?.userId;
      const checkData = await Recruiter.find({
        _id: recruiter_id,
      });
      const checkUser = await Job.find({
        _id: objectId,
        recruiter_id: recruiter_id,
      });
      if (checkData.length === 0) {
        res.status(400).json({
          status: false,
          message: "please provide the right token.",
        });
      } else if (checkUser.length === 0) {
        res.status(400).json({
          status: false,
          message: "Job not found for the given job_id.",
        });
      }

      if (checkData && Object.keys(checkData).length > 0) {
        const updateData = await Job.findByIdAndUpdate(objectId, {
          active: req.body.active,
        });
        res.status(200).json({
          status: true,
          message: "your job updated.",
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

  static async applyUserList(req, res) {
    try {
      const result = await Job.aggregate([
        {
          $lookup: {
            from: "applyjobs",
            localField: "_id",
            foreignField: "job_id",
            as: "applications",
          },
        },
      ]).exec();
      const mergedResult = result.map((job) => {
        const mergedDocument = { ...job, ...job.applications[0] };
        delete mergedDocument.applications;
        return mergedDocument;
      });
      const data = mergedResult
        .filter((job) => job.recruiter_id == req.userId && job.candidate_id)
        .map((job) => {
          return job;
        });
      if (result.length > 0) {
        if (data.length > 0) {
          res.status(200).json({
            status: true,
            message: "Candidate list who have applied to the job you created. ",
            data: data,
          });
        } else {
          res.status(200).json({
            status: true,
            message: "No one has yet applied for the job created by you.",
          });
        }
      } else {
        res.status(200).json({
          status: true,
          message: "You have not created any jobs.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const recruiter_id = req.userId;
      const status = req.body.status;
      const candidate_id = req.body.candidate_id;
      const job_id = req.body.job_id;
      const checkJob = await ApplyJob.findOne({
        candidate_id: candidate_id,
        recruiter_id: recruiter_id,
        job_id: job_id,
      });

      if (checkJob && Object.keys(checkJob).length > 0) {
        if (status === "ACCEPTED" || status == "REJECTED ") {
          const updateData = await ApplyJob.findByIdAndUpdate(checkJob._id, {
            status: status,
          });
          res.status(200).json({
            status: true,
            message: "status updated.",
          });
        } else {
          res.status(200).json({
            status: true,
            message: "this status already updated in your db.",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "please provide right info.",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message,
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

        const allCandidates = await Candidate.find({}, { password: 0 })
          .skip(skip)
          .limit(limit);
        const totalPages = Math.ceil(allCandidates.length / limit);
        const finalData = await Promise.all(
          allCandidates.map(async (item, index) => {
            const currentModulePath = new URL(import.meta.url).pathname;
            const currentModuleDir = path.dirname(currentModulePath);
            if (item.profile) {
              const imagePath = path.join(
                currentModuleDir,
                "../uploads/candidate",
                item.profile
              );

              await fsPromises.access(imagePath, fsPromises.constants.F_OK);
              const imageBuffer = await fsPromises.readFile(imagePath);
              const imageBase64 = imageBuffer.toString("base64");

              const newItem = {
                ...item._doc,
                profile: `data:image/jpeg;base64,${imageBase64}`,
              };
              return newItem;
            } else {
              return item;
            }
          })
        );

        res.status(200).json({
          status: true,
          message: "list of candidate user",
          data: { list: finalData, pageNumber: page, limit, totalPages },
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
  
}
