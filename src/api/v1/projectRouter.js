const express = require("express");
const router = express.Router();
const { addProject,getAllProjects,getProjectById } = require("../../controllers/project.controller");
const auth = require("../../middlewares/Auth");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',getAllProjects)
router.get('/:id',getProjectById)
router.post("/new", auth, upload.fields([{ name: 'image' }, { name: 'pdf' }]), addProject);

module.exports = router;
