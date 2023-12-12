const express = require("express");
const {
  getAllEmployer,
  getAllEmployerById,

  loginEmployer,

  updateEmployer,

  registrationthroughAdmin,
} = require("../controller/employerCtrl");

const router = express.Router();

const verifyToken = require("../middleware/auth");

// // Define allowed roles for a specific API
// const allowedRoles1 = ["admin", "subadmin", "employer"];
// const allowedRoles2 = ["admin", "subadmin", "manpower"];
// const allowedRoles3 = ["admin", "subadmin", "agent"];
// const allowedRoles4 = ["admin", "subadmin"];
// const allowedRoles5 = ["admin"];

// // Use the middleware with the specific set of allowed roles
// app.get("/api/specific-endpoint", verifyToken(allowedRolesForSpecificAPI), (req, res) => {
//   // Your API logic here
// });

router.post(
  "/registrationthroughAdmin",
  verifyToken.verifyToken(allowedRoles4),
  registrationthroughAdmin
);
//////////////////////////////////////////////////////////////////////////////

router.post("/login", loginEmployer);

router.get("/getAll", getAllEmployer);
router.get("/:id", getAllEmployerById);
router.put("/update/Employer/:id", cpUpload, updateEmployer);

module.exports = router;
