const sellModel = require('../models/productModel');
const productModel = require('../models/wholesalerModel');  

const addproduct = async (req, res) => {
    try {
        const { userid, productName, productCategory, date } = req.body;

        let parsedCategories;
        try {
            parsedCategories = JSON.parse(productCategory);
        } catch (err) {
            return res.status(400).json({ message: "Invalid productCategory format" });
        }

        parsedCategories = parsedCategories.map(cat => ({
            quality: cat.quality,
            price: Number(cat.price),
        }));

        const productImage = req.file ? req.file.path : null; // Cloudinary URL

        const newProduct = new productModel({
            userid,
            productName,
            productCategory: parsedCategories,
            date,
            productImage
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
        const products=await productModel.find()
        console.log(products)
        res.json(products)
    }catch(err){
        console.log(err)
    }
}

const viewProductsById = async (req, res) => {
    try {
        const userId = req.headers.userid;
        
        if (!userId) {
            return res.status(400).json({ error: "User ID is required in headers" });
        }

        const products = await productModel.find({ userid: userId });
        if (!products.length) {
            return res.status(404).json({ message: "No products found for this user" });
        }

        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const purchaseProduct=async(req,res)=>{
    try{
        const {userId,productId,quantity,pickupLocation}=req.body
        console.log(req.body)
        const productPurchased=new sellModel({
            userId,
            productId,
            quantity,
            pickuplocation:pickupLocation
        })
        await productPurchased.save()
        res.json("Product placed successfully wait for our call.")
    }catch(err){
        console.log(err)
    }
}

const viewplacedOrders=async(req,res)=>{
    try{
        const orders=await sellModel.find().populate("userId")  
        .populate("productId"); 
        res.json(orders)
    }catch(err){
        console.log(err)
    }
}


const updateStatus=async(req,res)=>{
    try{
        const {message,id}=req.body
        const product=await sellModel.findOne({_id:id})
        product.status=message
        product.save()
        res.json(`Order ${message} successfully`)
    }catch(err){
        console.log(err)
    }
}

const updatePayment=async(req,res)=>{
    try{
        const {status,id,quality,totalprice}=req.body
        console.log(req.body)
        const product=await sellModel.findOne({_id:id})
        product.status=status
        product.quality=quality
        product.totalprice=totalprice
        product.save()
        res.json(`Order ${status} successfully`)
    }catch(err){
        console.log(err)
    }
}

const deleteProduct=async(req,res)=>{
    try{
        const id=req.headers._id;
        await productModel.deleteOne({_id:id})
        res.json("Product deleted successfully")
    }catch(err){
        console.log(err)
    }
}

const updateProduct = async (req, res) => {
    try {
      const { productId, date, productCategory } = req.body;
  
      if (!productId || !date || !productCategory) {
        return res.status(400).json({ message: "All fields are required!" });
      }
  
      const updatedProduct = await productModel.findByIdAndUpdate(
        productId,
        { date, productCategory },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found!" });
      }
  
      res.status(200).json({ message: "Product updated successfully!", updatedProduct });
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
module.exports = { addproduct,viewProducts,viewProductsById,purchaseProduct,viewplacedOrders,updateStatus,updateProduct,deleteProduct,updatePayment}; 
