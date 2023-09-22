const Project = require("../models/Project");
const { google } = require("googleapis");
const { Readable } = require("stream");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// Upload a file to google drive
async function uploadToDrive(pdfMetadata, pdfMedia) {
  try {
    const pdfResult = await drive.files.create({
      resource: pdfMetadata,
      media: pdfMedia,
      fields: "id",
    });
    console.log(
      "Files uploaded successfully." +
        " PDF ID: " +
        pdfResult.data.id
    );
    return {
      pdfId: pdfResult.data.id,
    };
  } catch (err) {
    console.error("Error uploading image:", err);
    return null;
  }
}

//Get public url
async function getPublicUrl(id) {
  try {
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: id,
      fields: "webViewLink, webContentLink",
      supportsAllDrives: true,
    });
    const publicUrl = result.data.webViewLink;
    const downloadUrl = result.data.webContentLink;
    return { publicUrl, downloadUrl };
  } catch (err) {
    console.error(err);
    return null;
  }
}

const addProject = async (req, res) => {
  try {
    const pdfFile = req.files["pdf"][0];
    const data = JSON.parse(req.body.data);
    const pic = JSON.parse(req.body.cover);
    const Info = JSON.parse(req.body.info);
    const { Title, Description, Category, CollegeName, CollegeEmail, State } =
      data;
    const AuthorId = req.user_id;
    const { Name: AuthorName, pic: AuthorImage } = req.rootUser;

    const fileMetadata = {
      name: pdfFile.originalname,
    };
    const fileMedia = {
      mimeType: pdfFile.mimetype,
      body: Readable.from(Buffer.from(pdfFile.buffer, "base64")),
    };

    const uploadResult = await uploadToDrive(
      fileMetadata,
      fileMedia
    );
    console.log("Result: " + uploadResult);
    const { pdfId } = uploadResult;
    if ( !pdfId) {
      res.sendStatus(500);
      return;
    }
    const { publicUrl: ViewLink, downloadUrl: DownloadLink } =
      await getPublicUrl(pdfId);
    const project = new Project({
      Title,
      Description,
      Category,
      CollegeName,
      CollegeEmail,
      State,
      CoverPic:pic,
      Info,
      DownloadLink,
      ViewLink,
      AuthorId,
      AuthorName,
      AuthorImage,
    });
    await project.save();
    res.status(201).json({ Messege: "Project Created Successfull", project });
  } catch (err) {
    console.error(err);
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
};


async function getAllProjects(req,res){
    try{
      const projects=await Project.find();
      console.log(projects);
      res.status(200).json({Messege: "Project getting Successfull", data:projects});
    }catch(err){
      res.status(422).json({ Messege: "Something Went Wrong" });
    }
}

async function getProjectById(req,res){
  const {id}=req.params;
  try{
    const project=await Project.findById(id);
    res.status(200).json({Messege: "Project getting Successfull", data:project});
  }catch(err){
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
}
async function getProjectByCollegeEmail(req,res){
  const {email}=req.params;
  try{
    const projects=await Project.find({CollegeEmail:email});
    // console.log(projects);
    res.status(200).json({Messege: "Projects getting Successfull", data:projects});
  }catch(err){
    res.status(422).json({ Messege: "Something Went Wrong" });
  }
}


module.exports = { addProject,getAllProjects,getProjectById,getProjectByCollegeEmail };
