const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  name: String,
  adhaar: String,
  dob: String,
  img: {
    data: Buffer,
    contentType: String,
  },
   visibility: String
});

module.exports = ImageModel = mongoose.model("Image", imgSchema);
