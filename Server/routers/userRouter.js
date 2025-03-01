const express=require('express')
const { registerUser, login, userProfile, viewplacedOrders, addContact, updateProfile } = require('../controls/userControl')
const userRouter=express.Router()


userRouter.route("/registeruser").post(registerUser)
userRouter.route("/login").post(login)
userRouter.route("/profile").get(userProfile)
userRouter.route("/vieworders").get(viewplacedOrders)
userRouter.route("/contact").post(addContact)
userRouter.route("/update").put(updateProfile)

module.exports=userRouter