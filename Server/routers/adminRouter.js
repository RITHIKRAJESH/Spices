const express=require('express')
const { login, viewfarmers, addTips, viewtips, deleteTips, viewCount, deleteUsers, viewMessages,sentResponse, deleteMessage, updateMessageStatus } = require('../controls/adminControl')

const adminRouter=express.Router()

adminRouter.route("/login").post(login)
adminRouter.route("/viewfarmer").get(viewfarmers)
adminRouter.route("/addtips").post(addTips)
adminRouter.route("/viewtips").get(viewtips)
adminRouter.route("/deletetips").delete(deleteTips)
adminRouter.route("/countuser").get(viewCount)
adminRouter.route("/deleteuser").delete(deleteUsers)
adminRouter.route("/viewmessages").get(viewMessages)
adminRouter.route("/respond").post(sentResponse)
adminRouter.put("/updatestatus", updateMessageStatus);
adminRouter.delete("/deletemessage/:id", deleteMessage);
module.exports=adminRouter

