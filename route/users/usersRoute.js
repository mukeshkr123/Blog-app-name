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
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  profilePhotoUploadCtrl,
} = require("../../Controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  profilePhotoUpload,
} = require("../../middlewares/upload/profilePhotoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.put(
  "/profilephoto-upload",
  authMiddleware,
  profilePhotoUpload.single("image"),
  profilePhotoUploadCtrl
);
userRoutes.get("/", authMiddleware, fetcUsersCtrl);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/profile/:id", authMiddleware, fetchUserCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);

userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.get("/:", userProfileCtrl);

module.exports = userRoutes;
