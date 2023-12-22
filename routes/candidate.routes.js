import express from "express";
import CandidateController from "../controllers/candidate.controllers.js";
import multer from "multer";
import verifyToken from "../MiddleWare/verifyToken.middleware.js"
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/candidate");
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${new Date().toISOString().slice(0, -8)}-${file.originalname}`
    );
  },
});

const upload = multer({ storage });

router.post("/sign-up",upload.single("profile"), CandidateController.signUp);

router.post("/sign-in", CandidateController.signIn);

router.post("/apply-job",verifyToken,CandidateController.applyjob);

router.get("/apply-job-list",verifyToken,CandidateController.applyJobList);

router.get("/recruiter-list",verifyToken,CandidateController.recruiterList)

router.post("/update-profile",upload.single("profile"),verifyToken,CandidateController.profileUpdate)

router.get("/getProfile",verifyToken,CandidateController.getProfile)

export default router;
