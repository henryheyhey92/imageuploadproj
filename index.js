const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs").promises;
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `pexels-${Date.now()}.jpg`);
  },
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("Only Image is Allowed.."));
  }
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

//add routes here

async function main() {
  app.get("/welcome", async function (req, res) {
    console.log("enter");
    res.json({
      message: "You got it!",
    });
  });

  app.get("/retrieve/image", async function (req, res) {
    try {
      const jsonData = require("./image.json");
      res.status(200);
      res.send(jsonData);
    } catch (e) {
      res.status(500);
      console.log(e);
      res.json({
        message: "Internal server error",
      });
    }
  });

  app.post("/user/upload", upload.single("photo"), async (req, res) => {
    console.log("enter");
    if (req.file) {
      console.log(req.file);
      
      const file = await fs.readFile("image.json", 'utf-8', (err, jsonString) => {
        if(err) {
            console.log(err);
        }else{
            try {
                const data = JSON.parse(jsonString);
                console.log(data.address);
            }catch (err){
                console.log('Error parsing JSON', err);
            }
        }
      });
      users = JSON.parse(file);
      
      const count = users.images.filter(item => item.id !== 0).length;

      const newImage = {
        src: `/images/pexels-${Date.now()}.jpg`,
        id: count+1,
        Sequence: "",
        isDeleted: "",
        Title: "",
        PrimaryImage: true,
        name: "pexels-"+count+1,
      };


      users.images.push(newImage);
      console.log(users);
      await fs.writeFile("image.json", JSON.stringify(users, null, 2), err => {
        if(err){
            console.log(err);
        }else{
            console.log("Successfully written")
        }
      })

      res.status(200).json({
        success: "Success",
      });
    }
  });
}

main();

app.listen(3002, () => {
  console.log("Server started");
});
