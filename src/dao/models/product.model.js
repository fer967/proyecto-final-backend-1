const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    img:{
        type:String,
    },
    code:{
        type:String,
        require:true,
        unique:true
    },
    stock:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        require:true
    },
    thumbnails:{
        type:[String]
    }
})

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model("products", productSchema);
module.exports = productModel;