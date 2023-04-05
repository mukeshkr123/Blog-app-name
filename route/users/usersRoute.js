const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  deleteUserCtrl,
  fetcUsersCtrl,
  fetchUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
} = require("../../Controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/", authMiddleware, fetcUsersCtrl);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/profile/:id", authMiddleware, fetchUserCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.get("/:", userProfileCtrl);

module.exports = userRoutes;
