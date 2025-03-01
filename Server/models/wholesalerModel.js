const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "user_tbl", required: true }, 
    productName: { type: String, required: true },
    productImage: { type: String },
    productCategory: [
        {
            quality: { type: String, required: true }, 
            price: { type: Number, required: true } 
        }
    ],
    date: { type: String, required: true },
}, { timestamps: true });

const productModel = mongoose.model("product_tbl", productSchema);

module.exports = productModel; 