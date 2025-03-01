const express = require("express");
const { addproduct, viewProductsById, viewProducts, purchaseProduct, viewplacedOrders, updateStatus, deleteProduct, updateProduct, updatePayment } = require("../controls/wholesaleControl");
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
const upload = multer({ storage: storage }).single("productImage");

// Apply the upload middleware to the route
WholesaleRouter.post("/addproduct", upload, addproduct);
WholesaleRouter.get("/viewproductbyid", viewProductsById);
WholesaleRouter.get("/viewproduct", viewProducts);
WholesaleRouter.post("/productpurchased",purchaseProduct)
WholesaleRouter.get("/vieworders",viewplacedOrders)
WholesaleRouter.post("/updatestatus",updateStatus)
WholesaleRouter.delete("/deleteproduct",deleteProduct)
WholesaleRouter.put("/updateproduct", updateProduct)
WholesaleRouter.post("/updatepayment",updatePayment)
module.exports = WholesaleRouter;
