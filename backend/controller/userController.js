const { genrateToken } = require("../config/jwtToken");
const User = require("../modles/userModel");
const asyncHandler = require("express-async-handler");
const validatemongoDbId = require("../utils/validatemongoDb");
const { genrateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
// Register User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist!");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await genrateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: genrateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");

  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present in DB or not matched");
  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error("there is something wrong with refresh token");
    const accessToken = genrateRefreshToken(user?._id);
    res.json({ accessToken });
  });
});

//  Logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookie");
  const refreshToken = cookie?.refreshToken;

  const user = await User?.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single User
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);

  try {
    const findUser = await User.findById(id);
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json({ deletedUser, msg: "User Deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const updateAUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validatemongoDbId(_id);

  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        email: req.body?.email,
        mobile: req.body?.mobile,
      },
      { new: true }
    );
    res.json({ updateUser, msg: "user updated successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);

  try {
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ blockedUser, msg: "user blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validatemongoDbId(id);
  try {
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ unblockedUser, msg: "user unblocked" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
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
};
