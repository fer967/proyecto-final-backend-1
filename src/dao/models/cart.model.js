const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:String,
                require:true
            },
            quantity:{
                type:Number,
                require:true
            }
        }
    ]
})
const cartModel = mongoose.model("carts", cartSchema);
module.exports = cartModel; 
