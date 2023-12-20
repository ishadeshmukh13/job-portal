import express from "express";
import CandidateController from "../controllers/candidate.controllers.js";
import multer from "multer";
import verfiyToken from "../MiddleWare/verifyToken.middleware.js"
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

router.post("/sign-up", upload.single("dp"), CandidateController.signUp);

router.post("/sign-in", CandidateController.signIn);

router.get(
  "/listOfCandidate",
  verfiyToken,
  CandidateController.listOfCandidate
);
router.post(
  "/apply-job",
  verfiyToken,
  CandidateController.applyjob
);

router.get(
  "/apply-job-list",
  verfiyToken,
  CandidateController.applyJobList
);



export default router;
