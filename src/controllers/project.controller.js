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
async function uploadToDrive(imageMetadata, imageMedia, pdfMetadata, pdfMedia) {
  try {
    const imageResult = await drive.files.create({
      resource: imageMetadata,
      media: imageMedia,
      fields: "id",
    });
    const pdfResult = await drive.files.create({
      resource: pdfMetadata,
      media: pdfMedia,
      fields: "id",
    });
    console.log(
      "Files uploaded successfully. Image ID: " +
        imageResult.data.id +
        ", PDF ID: " +
        pdfResult.data.id
    );
    return {
      imageId: imageResult.data.id,
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
    const imageFile = req.files["image"][0];
    const pdfFile = req.files["pdf"][0];
    const data = JSON.parse(req.body.data);
    const { Title, Description, Category, CollegeName, CollegeEmail, State } =
      data;
    const AuthorId = req.user_id;
    const { Name: AuthorName, pic: AuthorImage } = req.rootUser;

    const imageMetadata = {
      name: imageFile.originalname,
    };
    const imageMedia = {
      mimeType: imageFile.mimetype,
      body: Readable.from(Buffer.from(imageFile.buffer, "base64")),
    };
    const fileMetadata = {
      name: pdfFile.originalname,
    };
    const fileMedia = {
      mimeType: pdfFile.mimetype,
      body: Readable.from(Buffer.from(pdfFile.buffer, "base64")),
    };

    const uploadResult = await uploadToDrive(
      imageMetadata,
      imageMedia,
      fileMetadata,
      fileMedia
    );
    console.log("Result: " + uploadResult);
    const { imageId, pdfId } = uploadResult;
    if (!imageId || !pdfId) {
      res.sendStatus(500);
      return;
    }
    const { publicUrl: CoverPic } = await getPublicUrl(imageId);
    const { publicUrl: ViewLink, downloadUrl: DownloadLink } =
      await getPublicUrl(pdfId);
    const project = new Project({
      Title,
      Description,
      Category,
      CollegeName,
      CollegeEmail,
      State,
      CoverPic,
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

module.exports = { addProject };
