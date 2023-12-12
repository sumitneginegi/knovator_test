const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {
    employerName: String,
    mobile: String,
    email: String,
    otp: String,

    siteLocation: String,

    radius: String,

    lati: String,
    longi: String,
    current_lati: String,
    current_longi: String,
    current_location: String,

    serviceLocation: { lati: Number, longi: Number },
  },

  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
