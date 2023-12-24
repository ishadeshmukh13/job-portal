import express from "express";
import RecruiterController from "../controllers/recruiter.controller.js";
const router = express.Router();
import multer from "multer";
import verifyToken from "../MiddleWare/verifyToken.middleware.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/recruiter");
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      `${new Date().toISOString().slice(0, -8)}-${file.originalname}`
    );
  },
});

const upload = multer({ storage });

router.post("/sign-up", upload.single("profile"), RecruiterController.signUp);

router.post("/sign-in", RecruiterController.signIn);

router.put("/otp-verify",RecruiterController.otpVerification)

router.post("/create-job", verifyToken, RecruiterController.createJob);

router.get("/job-list", verifyToken, RecruiterController.jobList);

router.patch("/update-job/:id",verifyToken,RecruiterController.updateJobStatus);

router.get("/user-list-apply",verifyToken, RecruiterController.applyUserList);

router.post("/updateStatus",verifyToken,RecruiterController.updateStatus)

router.get("/listOfCandidate",verifyToken,RecruiterController.listOfCandidate);

router.patch("/edit-job",verifyToken,RecruiterController.editJob);

router.delete("/delete-job",verifyToken,RecruiterController.deleteJob);

router.post("/update-profile",upload.single("profile"),verifyToken,RecruiterController.profileUpdate)

router.get("/getProfile",verifyToken,RecruiterController.getProfile)

router.put("/resetPassword",verifyToken,RecruiterController.resetPassword)

export default router;
