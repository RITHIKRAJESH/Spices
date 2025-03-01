const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String},
    shopOrFarmName:{type:String},
    mobile:{type:String},
    accountno:{type:String},
    ifsc:{type:String}, 
},{timestamps:true})


const userModel=new mongoose.model("user_tbl",userSchema)

module.exports=userModel