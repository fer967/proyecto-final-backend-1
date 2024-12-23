const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');                 
    next();
});

const CartModel = mongoose.model("carts", cartSchema);
module.exports = CartModel;


/*const mongoose = require("mongoose");
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
const CartModel = mongoose.model("carts", cartSchema);
module.exports = CartModel; */

