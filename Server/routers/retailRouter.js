// const express = require("express");
// const { addproduct, viewProducts, updateProduct, viewProduct} = require("../controls/retailerControl");
// const multer = require("multer");
// const { v2: cloudinary } = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");

// require("dotenv").config();

// const retailRouter = express.Router();

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "retails", 
//         allowedFormats: ["jpg", "jpeg", "png", "gif"],
//         public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
//     },
// });


// const upload = multer({ storage: storage }).single("productImage");


// retailRouter.post("/addproduct", upload, addproduct);
// retailRouter.get("/viewproducts",viewProducts)
// retailRouter.put("/updateproduct/:id", upload.single("productImage"), updateProduct);
// retailRouter.get("/viewproduct",viewProduct)
// module.exports = retailRouter;
const express = require("express");
const { addproduct, viewProducts, updateProduct, viewProduct, deleteProduct } = require("../controls/retailerControl");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

const retailRouter = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Configuration for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "retails", // Cloudinary folder where the images will be stored
    allowedFormats: ["jpg", "jpeg", "png", "gif"], // Allowed image formats
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Public ID format for the image
  },
});

// Set up multer with Cloudinary storage for image uploads
const upload = multer({ storage: storage }).single("productImage");

// Routes for Product Management

// Add Product (with image upload)
retailRouter.post("/addproduct", upload, addproduct);

// View all Products
retailRouter.get("/viewproducts", viewProducts);

// Update Product (with image upload)
retailRouter.put("/updateproduct/:id", upload, updateProduct);

// View a specific product
retailRouter.get("/viewproduct", viewProduct);

retailRouter.delete("/deleteproduct/:id",deleteProduct)

module.exports = retailRouter;
