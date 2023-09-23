require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 4000;
// Requiring Database connection
require('./config/db.config.js')


//Requiring Routers
const userRouter = require('./api/v1/userRouter')
const authRouter = require('./api/v1/authRouter')
const projectRouter = require('./api/v1/projectRouter')
const collegeRouter = require('./api/v1/collegeRouter')



//Configuring middlewares
app.use(fileUpload());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Router Handling middlewares
app.get('/', (req, res) => {
    res.send("Server is running")
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/project', projectRouter)
app.use('/api/v1/college', collegeRouter)




app.listen(port, () => console.log(`Server Starts on port ${port}`));