const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

const Knovator = require("../model/user");

exports.Create_knovators = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const knovator = new Knovator(req.body);
    
    const savedKnovator = await knovator.save();
    res.json(savedKnovator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.login_User = async (req, res) => {

    const userEmail = req.body.email
    console.log(userEmail);
    const password = req.body.password
    try {
      const user = await Knovator.findOne({ email: userEmail });
  console.log(user)
      if (!user) {
        return res.status(401).json({ error: "Invalid email" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.setHeader("Authorization");
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

exports.get_knovators = async (req, res) => {
  try {
    const knovators = await Knovator.find();
    res.json(knovators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.get_By_Id_knovators = async (req, res) => {
  try {
    const knovator = await Knovator.findById(req.params.id);
    res.json(knovator);
  } catch (error) {
    res.status(404).json({ error: "Knovator not found" });
  }
};

exports.put_knovators_By_Id = async (req, res) => {
  try {
    const knovator = await Knovator.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(knovator);
  } catch (error) {
    res.status(404).json({ error: "Knovator not found" });
  }
};

exports.deleteByid = async (req, res) => {
  try {
    const knovator = await Knovator.findByIdAndDelete(req.params.id);
    res.json({ message: "Knovator deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Knovator not found" });
  }
};




exports.findUserthroughRadius = async (req, res) => {
  try {
    const { userid1,userid2, radiusInKm } = req.body;

    const emp1 = await Knovator.findById(userid1);
    

    if (!emp1) {
      return res.status(400).json({ message: "Invalid user ID 1" });
    }

    const emp2 = await Knovator.findById(userid2);
    console.log(emp2);

    if (!emp2) {
      return res.status(400).json({ message: "Invalid user ID 2" });
    }
    const { lati: lat1, longi: lon1 } = emp1;
    const { lati: lat2, longi: lon2 } = emp2;

    const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);

    if (distance <= radiusInKm) {
      return res.json({
        message: "Users are within the specified radius.",
        distance: distance,
      });
    } else {
      return res.json({
        message: "Users are outside the specified radius.",
        distance: distance,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
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


