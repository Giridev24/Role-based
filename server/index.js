const express = require("express");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const imageModel = require("./models/product");
const User = require("./models/user");
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const uri = process.env.MONGO_URL;
const port = process.env.PORT;
const secret_key = process.env.SECRET__KEY;


const corsOptions = {
  origin: 'https://role-based-client.vercel.app',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};


app.use(cors(corsOptions));
app.use(cookieparser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

mongoose 
  .connect(uri) 
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);  
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }); 

app.post("/upload", upload.single("testImage"), (req, res) => {
  const saveImage = new imageModel({
    name: req.body.name,
    adhaar: req.body.adhaar,
    dob: req.body.dob,
    img: {
      data: fs.readFileSync(path.join("uploads", req.file.filename)),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then(() => {
      console.log("Image is saved");
      res.send("Image is saved");
    })
    .catch((err) => {
      console.error("Error saving image:", err);
      res.status(500).send("Error saving image");
    });
});

/*
const verifyAdmin = (req,res,next) =>{
  const token = req.cookies.token;
  if(!token){
    return res.json("the token was not available")
  } else{
    jwt.verify(token,"jwt-secret-key", (err,decoded) => {
          if(err) return res.json("token is wrong")
            next()
    })
  }
}*/

//new
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, msg: 'Token not available' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, msg: 'Token invalid' });
  }
};


/*
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({email:user.email}, "jwt-secret-key",{expiresIn:"1d"})
            res.cookie("token",token);
            res.json({ message: "success", userrole: user.userrole, email: user.email });
          } else {
            res.status(401).json({ message: "The password is incorrect" });
          }
        });
      } else {
        res.status(404).json({ message: "User not existing" });
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});*/

//new
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found")
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("wrong password")
      return res.status(400).json({ success: false, msg: "Incorrect password" });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });
    res.cookie('token', token);
    res.json({
      success: true,
      msg: "Login successful",
      userrole: user.userrole,
      email: user.email,
      token
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});





app.post("/signup", (req, res) => {
  const { email, password, userrole } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, userrole })
        .then((employee) => res.json(employee))
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => console.log(err.message));
});

app.get("/admin", async (req, res) => {
  try {
    const allData = await imageModel.find();
    res.json(allData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.put("/admin/:id", async (req, res) => {
  const { id } = req.params;
  const { name, adhaar, dob } = req.body;

  try {
    const updatecard = await imageModel.findByIdAndUpdate(
      id,
      { name, adhaar, dob },
      { new: true }
    );

    if (!updatecard) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatecard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/admin/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteproduct = await imageModel.findByIdAndDelete(id);

    if (!deleteproduct) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running on port ${port} `); 
});
