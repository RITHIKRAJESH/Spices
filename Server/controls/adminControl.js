const { model } = require('mongoose')
const userModel=require('../models/userModel')
const tipsModel=require('../models/tipsModel')
const productModel=require('../models/productModel')
const contactModel=require('../models/contactModel')
const nodemailer=require('nodemailer')
const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await userModel.findOne({email:email})
        if(!user){
            res.json({msg:"Admin Don't exists",status:500})
        }else{
            if(user.password==password){
                res.json({msg:"Login Successfull",status:200})
            }
            else{
                res.json({msg:"Admin password wrong",status:500})
            }
        }
    }
    catch(err){
        console.log(err)
    }
}

const viewfarmers=async(req,res)=>{
   try{
    const users=await userModel.find({role: { $ne: "admin" }})
    res.json(users).status(200)
   }catch(err){
    console.log(err)
   }
}


const addTips=(req,res)=>{
    try{
        const{title,text}=req.body
        console.log(req.body)
        const tips=new tipsModel({
            title,text
        })
        tips.save()
        res.json("Tips added successfully")
    }catch(err){
        console.log(err)
    }
}


const viewtips=async(req,res)=>{
   try{
    const tips=await tipsModel.find()
    res.json(tips)
   }catch(err){
    console.log(err)
   }
}

const deleteTips=async(req,res)=>{
    try{
        const id=req.headers.id
        await tipsModel.deleteOne({_id:id})
        res.json("Data deleted successfully")
    }
    catch(err){
        console.log(err)
    }
}


const viewCount = async (req, res) => {
    try {
      const userCount = await userModel.countDocuments();
      const productCount = await productModel.countDocuments();
      const orderCount = await tipsModel.countDocuments();
      const messageCount = await contactModel.countDocuments();
      res.status(200).json({
        users: userCount,
        products: productCount,
        orders: orderCount,
        messages: messageCount,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const deleteUsers=async(req,res)=>{
    try{
        const id=req.headers._id
        await userModel.deleteOne({_id:id})
        res.json("Data deleted successfully")
    }
    catch(err){
        console.log(err)
    }
}

const viewMessages=async(req,res)=>{
    try{
        const messages=await contactModel.find()
        console.log(messages)
        res.json(messages)
    }catch(err){
        console.log(err)
    }
}

const sentResponse = async (req, res) => {
    try {
        const { email, message,status} = req.body;
        
        let transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: '123.com', 
                pass: process.env.App_Key, 
            },
        });
        const updatedMessage= await contactModel.findOneAndUpdate({
            email: email,
            status: 'replied',
            message: message
        });
        await updatedMessage.save();
        const mailOptions = {
            from: '123@gmail.com', 
            to: email, 
            subject: 'Response from BrewVault',
            text: message, 
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error sending email: ', err);
                return res.status(500).json({ error: 'Failed to send response email.' });
            }
            console.log('Email sent: ' + info.response);
           
            return res.json({ msg: 'Response sent successfully' });
        });
         
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong while sending the email.' });
    }
};

// Update Message Status
const updateMessageStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const updatedMessage = await contactModel.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json({ msg: "Message status updated successfully", updatedMessage });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error updating message status" });
    }
};

// Delete Message
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await contactModel.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json({ msg: "Message deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error deleting message" });
    }
};


module.exports={login,viewfarmers,addTips,viewtips,deleteTips,viewCount,deleteUsers,deleteMessage,viewMessages,sentResponse,updateMessageStatus}