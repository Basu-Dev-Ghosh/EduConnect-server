const express = require("express");
const router = express.Router();
const { addProject,getAllProjects,getProjectById, getProjectByCollegeEmail,approveProject,rejectProject } = require("../../controllers/project.controller");
const auth = require("../../middlewares/Auth");
const multer = require("multer");
const auth2 = require("../../middlewares/Auth2");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',getAllProjects)
router.get('/:id',getProjectById)
router.get('/college/:email',auth2,getProjectByCollegeEmail)
router.post("/new", auth, addProject);
router.get('/approve/:id',auth2,approveProject)
router.get('/reject/:id',auth2,rejectProject)

module.exports = router;
