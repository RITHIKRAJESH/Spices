const mongoose=require('mongoose')


const tipsSchema=new mongoose.Schema({
    // url:{type:String},
    title:{type:String},
    text:{type:String},
},{timeseries:true})

const tipsModel=new mongoose.model('tips_tbl',tipsSchema)

module.exports=tipsModel;
