const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "user_tbl", required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    quantity:{type:String},
    rate:{type:String}
},{timestamps:true})


const productModel=new mongoose.model("retailsproduct_tbl",productSchema)

module.exports=productModel