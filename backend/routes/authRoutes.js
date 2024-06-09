const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getAUser,
  deleteUser,
  updateAUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/get-users", getAllUsers);
router.get("/get-single-user/:id", authMiddleware, isAdmin, getAUser);
router.delete("/delete-single-user/:id", deleteUser);
router.put("/update-user/", authMiddleware, updateAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
