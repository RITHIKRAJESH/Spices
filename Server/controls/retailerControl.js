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

const updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const { productName, quantity, rate } = req.body;
  
      // If an image file is uploaded
      if (req.files && req.files.productImage) {
        const productImage = req.files.productImage[0].path; // Store file path of uploaded image
  
        // Update product with new data (including image path)
        const updatedProduct = await productModel.findByIdAndUpdate(
          productId,
          { productName, quantity, rate, productImage },
          { new: true }
        );
  
        return res.json({ message: "Product updated successfully!", product: updatedProduct });
      } else {
        // If no new image, just update other fields
        const updatedProduct = await productModel.findByIdAndUpdate(
          productId,
          { productName, quantity, rate },
          { new: true }
        );
  
        return res.json({ message: "Product updated successfully!", product: updatedProduct });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error updating product." });
    }
  };
  
  const deleteProduct=async(req,res)=>{
    const id=req.params.id
    await productModel.deleteOne({_id:id})
    res.json({message:"Product deleted successfully"})
  }

module.exports={addproduct,viewProducts,updateProduct,viewProduct,deleteProduct}