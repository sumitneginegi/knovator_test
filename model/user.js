const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const knovatorSchema = new mongoose.Schema(
  {
    Name: String,
    mobile: String,
    email: String,
    password:String,
    Title: String,
    Body: String,
    Active_Inactive: String,
    siteLocation: String,
    lati: String,
    longi: String,
  },
  {
    timestamps: true,
  }
);


const knovatorModel = mongoose.model("knovator", knovatorSchema);
module.exports = knovatorModel;
