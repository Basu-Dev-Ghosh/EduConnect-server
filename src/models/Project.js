const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  Category: {
    type: String,
    required: true,
  },
  CollegeName: {
    type: String,
    required: true,
  },
  CollegeEmail: {
    type: String,
    required: true,
  },
  State: {
    type: String,
  },
  Status: {
    type: String,
    default: "pending",
  },
  CoverPic: {
    type: String,
    required: true,
  },
  Info: {
    type: String,
  },
  DownloadLink: {
    type: String,
    required: true,
  },
  ViewLink: {
    type: String,
    required: true,
  },
  ReviewCount: {
    type: Number,
    default: 0,
  },
  AuthorId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  AuthorName: {
    type: String,
    required: true,
  },
  AuthorImage: {
    type: String,
  },
});

const Project = new mongoose.model("Project", ProjectSchema);
module.exports = Project;
