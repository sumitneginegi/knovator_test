
const Employerr = require("../models/employerModel");
const Manpowerr = require("../models/ManPowerModel");

const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');


exports.registrationthroughAdmin = async (req, res) => {
  try {

    const data = {
      employerName: req.body.employerName,
      active: req.body.active,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      createdAt: req.body.createdAt,
      state: req.body.state,
      city: req.body.city,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      pinCode: req.body.pinCode,
      aadharCard: req.body.aadharCard, // Updated field
      panCard: req.body.panCard, // Updated field,
      siteLocation: req.body.siteLocation,
    }

    var user = await User.findOne({ mobile: data.mobile, userType: "employer" })

    if (!user) {
      req.body.userType = "employer"


      const userCreate = await User.create({
        data,
        wallet: 100,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        mobile: userCreate.mobile,
        employerName: userCreate.employerName,
        active: userCreate.active,
        gender: userCreate.gender,
        email: userCreate.email,
        mobile: userCreate.mobile,
        createdAt: userCreate.createdAt,
        state: userCreate.state,
        city: userCreate.city,
        GST_Number: userCreate.GST_Number,
        registration_Number: userCreate.registration_Number,
        pinCode: userCreate.pinCode,
        aadharCard: userCreate.aadharCard,
        panCard: userCreate.panCard,
        siteLocation: userCreate.siteLocation,
      }

      res.status(201).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      })
    } else {
      return res.json({ status: 409, message: "Already Exit" });
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" });
  }
}




exports.updateEmployer = async (req, res) => {
  console.log("hi");
  const employerId = req.params.id;
  try {

    // let front = req.files["aadhar"];
    // let back = req.files["pan"]
    // req.body.aadhar = front[0].path;
    // req.body.pc = back[0].path;

    const updatedData = {
      employerName: req.body.employerName,
      active: req.body.active,
      gender: req.body.gender,
      email: req.body.email,
      createdAt: req.body.createdAt,
      state: req.body.state,
      city: req.body.city,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      aadharCard: req.body.aadharCard, // Updated field
      panCard: req.body.panCard, // Updated field
      current_lati: req.body.current_lati,
      current_longi: req.body.current_longi,
      current_location: req.body.current_location,
      main_Address: req.body.main_Address,
      about: req.body.about,
      pinCode: req.body.pinCode,
      uploadaadhar: req.body.aadhar,
      uploadPanCard: req.body.pc,
    };

    const updatedEmployer = await User.findByIdAndUpdate(employerId, updatedData, { new: true });

    if (!updatedEmployer) {
      return res.status(404).json({ msg: 'Employer not found' });
    }

    const responseEmployer = {
      employerName: updatedEmployer.employerName,
      active: updatedEmployer.active,
      gender: updatedEmployer.gender,
      email: updatedEmployer.email,
      createdAt: updatedEmployer.createdAt,
      state: updatedEmployer.state,
      city: updatedEmployer.city,
      GST_Number: updatedEmployer.GST_Number,
      registration_Number: updatedEmployer.registration_Number,
      aadharCard: updatedEmployer.aadharCard,
      panCard: updatedEmployer.panCard,
      current_lati: updatedEmployer.current_lati,
      current_longi: updatedEmployer.current_longi,
      current_location: updatedEmployer.current_location,
      main_Address: updatedEmployer.main_Address,
      about: updatedEmployer.about,
      pinCode: updatedEmployer.pinCode,
      uploadaadhar: updatedEmployer.aadhar,
      uploadPanCard: updatedEmployer.pc,
      // Add other properties you want to include
    };

    return res.status(200).json(responseEmployer);

    // return res.status(200).json({ updatedEmployer });
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'An error occurred', error: err.message });
  }
}


exports.getAllEmployer = async (req, res) => {
  try {
    const employers = await User.find({ userType: "employer" })
    console.log(employers)

    if (employers.length === 0) {
      return res.status(404).json({ error: "No employer data found." });
    }

    res.status(200).json({ success: true, data: employers });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}


exports.getAllEmployerById = async (req, res) => {
  const employerId = req.params.id;

  try {
    const employer = await User.findById(employerId).lean();

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // Iterate through the 'obj' array and fetch the associated 'Category' data for each object
    for (const obj of employer.obj) {
      const categoryId = obj.category;

      // Check if categoryId is a valid MongoDB ObjectID
      if (mongoose.Types.ObjectId.isValid(categoryId)) {
        const category = await Category.findById(categoryId).lean();
        obj.category = category;
      } else {
        // If categoryId is not a valid ObjectID, ignore it or handle it as needed
        // obj.category = null; // You can set it to null or any other value to indicate it's not a valid category
      }
    }

    res.status(200).json({ success: true, data: employer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}



exports.loginEmployer = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ error: "Mobile number required" });
    }
    const test = await User.findOne({ mobile: mobile, userType: "employer", });

    if (test) {
      const employer = await User.findOne({ mobile: mobile, userType: "employer", otp: otp });
      if (!employer) {

        return res.status(404).json({ error: "Otp is incorrect" });
      }
    }
    else {
      return res.status(404).json({ error: "employer not found" });
    }

    // employer.otp = otp
    // employer.save()

    const token = jwt.sign({ employerId: test._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        otp,
        employer: test,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}




exports.findManpowerthroughRadius = async (req, res) => {
  try {
    const { employerId, orderId, radiusInKm, category, body } = req.body;

    // Find the employer by employerId
    const employer = await User.findById(employerId);
    // console.log(employer.employerName);

    if (!employer || employer.userType !== "employer") {
      return res.status(400).json({ message: "Invalid employer ID" });
    }

    // Find the post within the employer's obj array by orderId
    const post = employer.obj.find((post) => post.orderId == orderId);
    console.log(post);
    if (!post) {
      return res.status(400).json({ message: "orderId not found" });
    }

    // Extract post details
    const {
      job_desc,
      siteLocation,
      explainYourWork,
      date
    } = post;

    // Extract the post's latitude and longitude
    const { lati, longi } = post;



    // Find the category with the provided name
    const categoryData = await Category.findOne({ name: category });

    if (!categoryData) {
      return res.status(400).json({ message: "Category not found" });
    }

    // Find manpower within the specified radius
    const manpowerWithinRadius = await User.find({
      "serviceLocation.lati": { $exists: true }, // Ensure serviceLocation exists
      "serviceLocation.longi": { $exists: true }, // Ensure serviceLocation exists
      userType: 'manpower', // Add this condition to filter by userType
      $or: [
        { category: categoryData ? categoryData._id : null }, // Check by category name and get ID
        { category: categoryData ? { $regex: new RegExp(categoryData.name, 'i') } : { $regex: new RegExp(category, 'i') } }, // Check by category name
      ],
    }).lean();

    console.log(manpowerWithinRadius);
    console.log("-------------------");


    const filteredManpower = manpowerWithinRadius.filter((manpower) => {
      const distance = getDistanceFromLatLonInKm(
        lati,
        longi,
        manpower.serviceLocation.lati,
        manpower.serviceLocation.longi
      );
      console.log(distance);
      return distance <= radiusInKm; // Filter by radius
    });

    console.log(filteredManpower);
    // Send notifications for each post
    for (const manpower of filteredManpower) {
      const message = {
        data: {
          userType: manpower.userType, // Custom data
          _id: manpower._id ? manpower._id.toString() : "",
          // employer:employer._id,
          // employerName: employer.employerName,
          // employerMobile: employer.mobile,
          payload: `employer:${employer._id},employerName: ${employer.employerName},employerMobile: ${employer.mobile},category:${categoryData.name || category},orderId:${orderId}, job_desc:${job_desc},siteLocation:${siteLocation},lati:${manpower.serviceLocation.lati},longi:${manpower.serviceLocation.longi},explainYourWork:${explainYourWork}, date:${date}`,
        },
        notification: {
          title: `Lead for ${category}`, // Corrected title property
          body: body,
        },
        // payload: {
        //   employer : `${employer._id}`,
        //   employerName: `${employer.employerName}`,
        //   employerMobile: `${employer.mobile}`,
        //   category:`${category}`,
        //    job_desc:`${job_desc}`,
        //    siteLocation:`${siteLocation}`,
        //    explainYourWork:`${explainYourWork}`,
        //     date:`${date}`
        // },
        token: manpower.token,
      };

      try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        console.log("------------------");
        // console.log('data:', response.data);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    io.emit('manpowerData', filteredManpower);
    return res.json({ data: filteredManpower.length, manpower: filteredManpower });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



// Function to calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}


// Utility function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


