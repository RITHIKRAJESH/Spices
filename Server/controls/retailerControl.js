const productModel = require('../models/retailproductModel');  

const addproduct = async (req, res) => {
    try {
        const { userid, productName, rate , quantity  } = req.body;
        const productImage = req.file ? req.file.path : null; // Cloudinary URL
        const newProduct = new productModel({
            userId:userid,
            productName, 
            quantity,
            rate,
            productImage, // Cloudinary Image URL
        });

        await newProduct.save();

        res.status(201).json({ message: "Product added successfully!", product: newProduct });

    } catch (error) {
        console.error("Error in addproduct:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}; 


const viewProducts=async(req,res)=>{
    try{
        const userid=req.headers.userid
        const products=await productModel.find({userId:userid})
        res.json(products)
    }catch(err){
        console.log(err)
    }
}

const viewProduct=async(req,res)=>{
    try{
        const products=await productModel.find()
        res.json(products)
    }catch(err){
        console.log(err)
    }
}

const updateProduct=async(req,res)=>{
    try{
        const {productId,quantity}=req.body
        await productModel
        .findByIdAndUpdate(productId, { quantity }, { new: true })
        res.json({message:"Quantity updated successfully!"})
    }catch(err){    
        console.log(err)
    }}
module.exports={addproduct,viewProducts,updateProduct,viewProduct}