const { json } = require("body-parser");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongodbId = require("../../utils/validateMongoDbID.js");

//-------------------------------------
//Register
//-------------------------------------

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  //Check if user Exist
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) throw new Error("User already exists");
  try {
    //Register user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      profilePhoto: req?.body?.profilePhoto,
      isAdmin: req?.body?.isAdmin,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
//Login
//-------------------------------------
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check if user Exist
  const userFound = await User.findOne({ email });
  // check if password matches
  if (userFound && (await userFound.isPasswordMatch(password))) {
    res.json({
      _id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
      profilePhoto: userFound.profilePhoto,
      token: generateToken(userFound._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

//-------------------------------------
//Fetch all users
//-------------------------------------
const fetcUsersCtrl = expressAsyncHandler(async (req, res, next) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
//delete user
//-------------------------------------

const deleteUserCtrl = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //check if user ois valid
  validateMongodbId(id);
  4;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------------
//get a single  user
//-------------------------------------

const fetchUserCtrl = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //check if user is valid
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
//user profile
//----------------------------------------------------------------

const userProfileCtrl = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //check if user is valid
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------------------------
//upadate user
//----------------------------------------------------------------

const updateUserCtrl = expressAsyncHandler(async (req, res, next) => {
  const { id } = req?.user;
  validateMongodbId(id);
  const user = await User.findByIdAndUpdate(
    id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json(user);
});

//----------------------------------------------------------------
// update user password
//----------------------------------------------------------------

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  // destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  // find the user by id
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  res.json(user);
});

//----------------------------------------------------------------
// following
//---------------------------------------------------------------

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //find the target user and check if they exist
  const targetUser = await User.findById(followId);
  const allreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() == loginUserId.toString()
  );
  if (allreadyFollowing) throw new Error("You have already followed this user");

  //1.find the user you want to follow and update it follower field properties
  await User.findByIdAndUpdate(
    followId,
    {
      $push: {
        followers: loginUserId,
      },
    },
    {
      new: true,
    }
  );

  //2. update the user follwing properties
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );
  res.json("succccessfully following the user");
});

//----------------------------------------------------------------
//  unfollow
//----------------------------------------------------------------

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: {
        followers: loginUserId,
      },
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );
  res.json(" you are successfully unfollowing");
});

//----------------------------------------------------------------
// Blocking user
//----------------------------------------------------------------

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

//----------------------------------------------------------------
// Blocking user
//----------------------------------------------------------------

const unblockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUserCtrl,
  fetcUsersCtrl,
  deleteUserCtrl,
  userProfileCtrl,
  updateUserCtrl,
  followingUserCtrl,
  updateUserPasswordCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
};

generateToken();
