const express=require('express')
const { registerUser, login, userProfile, viewplacedOrders, addContact, updateProfile, addToCart, viewCart, removeItem, decrementQuantity, incrementQuantity, retailOrder, viewOrder, updateOrderStatus } = require('../controls/userControl')
const userRouter=express.Router()
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

const WholesaleRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wholesaleproduct", // Change this to your desired folder in Cloudinary
        allowedFormats: ["jpg", "jpeg", "png", "gif"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique filename
    },
});

// Upload Middleware
const upload = multer({ storage: storage }).single("image");

userRouter.route("/registeruser").post(upload,registerUser)
userRouter.route("/login").post(login)
userRouter.route("/profile").get(userProfile)
userRouter.route("/vieworders").get(viewplacedOrders)
userRouter.route("/contact").post(addContact)
userRouter.route("/update").put(updateProfile)
userRouter.post("/addCart",addToCart)
userRouter.get("/viewCart",viewCart) 
userRouter.delete("/removeCartItem",removeItem)
userRouter.put("/incrementQuantity",incrementQuantity)
userRouter.put("/decrementQuantity",decrementQuantity)
userRouter.post("/checkout",retailOrder)
userRouter.get("/fetchOrder",viewOrder)
userRouter.put("/updateOrderStatus",updateOrderStatus)

module.exports=userRouter