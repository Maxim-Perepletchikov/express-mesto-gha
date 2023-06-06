const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUser);
userRouter.post("/users", createUser);
userRouter.patch("/users/me", updateUserInfo);
userRouter.patch("/users/me/avatar", updateAvatar);

module.exports = userRouter;
