const userModel=require('../models/userModel')
const argon2 = require('argon2')
const jwt=require("jsonwebtoken")
const sellModel=require('../models/productModel');
const contactModel = require('../models/contactModel');
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role, shopOrFarmName } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ msg: "User Already Exists", status: 400 });
        }

        // Hash the password using Argon2
        const hashedPassword = await argon2.hash(password);

        // Register new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            role,
            shopOrFarmName
        });
       
        await newUser.save();
        return res.json({ msg: "User Registered Successfully", status: 200 });

    } catch (err) {
        console.error("Error in registerUser:", err);
        return res.status(500).json({ msg: "Server Error", status: 500 });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ msg: "User Doesn't Exist", status: 500 });
        }

        // Verify password using Argon2
        const isPasswordValid = await argon2.verify(user.password, password);
        const token = jwt.sign({payload:user}, 
            'jwt-key-factor',
            { expiresIn: "7d" } 
        );
        if (isPasswordValid) {
            return res.json({ msg: "Login Successful", status: 200,token:token  });
        } else {
            return res.json({ msg: "Incorrect Password", status: 500 });
        }

    } catch (err) {
        console.error("Error in login:", err);
        return res.status(500).json({ msg: "Server Error", status: 500 });
    }
};


const userProfile=async(req,res)=>{
    try{
        const id=req.headers._id
        const user=await userModel.findOne({_id:id})
        res.json(user).status(200)
       
    }catch(err)
    {
        res.json(err)
    }
}

const updateProfile = async (req, res) => {
    try {
      const id = req.headers._id; // Extract user ID from request headers
      const { mobile, accountno, ifsc } = req.body; // Extract the fields to be updated from the request body
  
      // Find the user by ID and update the fields
      const user = await userModel.findOne({ _id: id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // If the user is not found, send a 404 response
      }
  
      // Update the user's details
      user.mobile = mobile || user.mobile;
      user.accountno = accountno || user.accountno;
      user.ifsc = ifsc || user.ifsc;
  
      // Save the updated user document
      const updatedUser = await user.save();
  
      // Respond with the updated user
      return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  
    } catch (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
  
const viewplacedOrders=async(req,res)=>{
    try{
        const userid=req.headers.id
        const orders=await sellModel.find({userId:userid})  
        .populate("productId"); 
        res.json(orders)
    }catch(err){
        console.log(err)
    }
}


const addContact=async(req,res)=>{
    try{
        const {name,email,message}=req.body
        const contact=new contactModel({
            name,email,message,status:"pending"
        })
        await contact.save()
        res.json({msg:"Message Received Successfully"})
    }catch(err){
        res.json(err)
}};

module.exports={registerUser,login,userProfile,viewplacedOrders,addContact,updateProfile}