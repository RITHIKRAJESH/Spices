const mongoose=require('mongoose')

const contactSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true},
    status:{type:String}
},{timestamps: true})

const contactModel=mongoose.model('Contact', contactSchema)
module.exports=contactModel