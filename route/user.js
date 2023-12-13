const express = require("express");
const {
  Create_knovators,
  login_User,
  get_knovators,
  get_By_Id_knovators,
  put_knovators_By_Id,
  deleteByid,
  findUserthroughRadius
} = require("../controller/user");

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
  "/Create_knovators",
//   verifyToken.verifyToken(allowedRoles4),
  Create_knovators
);
router.get("/get/knovators", get_knovators)

router.post("/login_User", login_User);


router.get("/get_By_Id/knovators/:id", get_By_Id_knovators);
router.put("/put/knovators/:id", put_knovators_By_Id);
router.delete("/delete/knovators/:id", deleteByid);
router.post("/findUserthroughRadius",findUserthroughRadius)

module.exports = router;
