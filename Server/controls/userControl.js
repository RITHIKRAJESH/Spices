const userModel=require('../models/userModel')
const argon2 = require('argon2')
const jwt=require("jsonwebtoken")
const sellModel=require('../models/productModel');
const contactModel = require('../models/contactModel');
const Cart=require('../models/cartModel')
const Order=require('../models/orderModel');
const productModel = require('../models/retailproductModel');
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role, shopOrFarmName } = req.body;
        const imagePath = req.file ? req.file.path : null;
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
            shopOrFarmName,
            detail:imagePath
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


const addToCart = async (req, res) => {
    const { productId, quantity, rate, productName } = req.body;
    const userId = req.body.userId; // The userId should be passed from the frontend (you can get this from decoded token)
  
    try {
      // Check if the user already has a cart
      let cart = await Cart.findOne({ userId: userId, status: { $ne: "Ordered" } });
      if (!cart) {
        // If the cart doesn't exist, create a new one
        cart = new Cart({
          userId,
          items: [{
            productId,
            productName,
            quantity,
            rate,
          }],
        });
        await cart.save();
        return res.json({ message: "Product added to the cart successfully." });
      }
  
      // Check if the product is already in the cart
      const existingProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
      if (existingProductIndex > -1) {
        // If the product is already in the cart, update its quantity
        cart.items[existingProductIndex].quantity += quantity; // You can change this logic if needed
        await cart.save();
        return res.json({ message: "Product quantity updated in the cart." });
      } else {
        // If the product is not in the cart, add it
        cart.items.push({
          productId,
          productName,
          quantity,
          rate,
        });
        await cart.save();
        return res.json({ message: "Product added to the cart." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred while adding the product to the cart." });
    }
  };

  const viewCart = async (req, res) => {
      const userId = req.headers.id; // Get userId from request headers
      console.log(userId)
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
    
      try {
        // Find the cart of the specified user with the status 'Cart'
        const cart = await Cart.findOne({ userId, status: "Cart" })
          .populate('items.productId', 'productName rate productImage'); // Populating product details
         console.log(cart)
        if (!cart) {
          return res.json({ message: "Cart not found for this user." });
        }
    if(cart.length==0){
      return res.json("Empty")
    }
        return res.json(cart); 
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while fetching the cart." });
      }
    };
    
    // In your router file (e.g., retailerRouter.js)
  
      const removeItem =async (req, res) => {
      try {
        const { itemId, _id } = req.body;
      //   const userId = req.headers._id; 
        console.log(_id,itemId)
        const cart = await Cart.findOne({ userId: _id,status:"Cart"});
        console.log(cart.items)
        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
        if (itemIndex === -1) {
          return res.status(404).json({ message: "Item not found in cart" });
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
    
        res.json({ message: "Item removed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to remove item" });
      }
    };
  
    const incrementQuantity = async (req, res) => {
      const { itemId, _id, quantity } = req.body;
      console.log(req.body); // Log the request body to debug
      
      try {
        // Find the cart for the given user
        const cartItem = await Cart.findOne({ userId: _id,status:"Cart" });
    
        if (!cartItem) {
          return res.status(404).json({ message: 'Cart not found for this user' });
        }
    
        // Find the index of the item within the cart's items array
        const itemIndex = cartItem.items.findIndex(item => item._id.toString() === itemId);
    
        if (itemIndex === -1) {
          return res.status(404).json({ message: 'Item not found in the cart' });
        }
    
        // Increment the quantity of the found item
        cartItem.items[itemIndex].quantity += 1;
    
        // Save the updated cart item
        await cartItem.save();
    
        // Return the updated cart item to the frontend
        res.status(200).json({ message: 'Quantity updated', cartItem });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating cart item' });
      }
    };
    
    // Decrement quantity of an item in the cart
    const decrementQuantity = async (req, res) => {
      const { itemId, _id, quantity } = req.body;
      console.log(req.body); // Log the request body to debug
      
      try {
        // Find the cart for the given user
        const cartItem = await Cart.findOne({ userId: _id,status:"Cart" });
    
        if (!cartItem) {
          return res.status(404).json({ message: 'Cart not found for this user' });
        }
    
        // Find the index of the item within the cart's items array
        const itemIndex = cartItem.items.findIndex(item => item._id.toString() === itemId);
    
        if (itemIndex === -1) {
          return res.status(404).json({ message: 'Item not found in the cart' });
        }
        cartItem.items[itemIndex].quantity -= 1;
        await cartItem.save();
        res.status(200).json({ message: 'Quantity updated', cartItem });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating cart item' });
      }
    };
  
const retailOrder = async (req, res) => {
    try {
      const { cartId, userId, deliveryAddress, paymentMethod, cardDetails, totalAmount } = req.body;
      
      // Find the cart by userId and status "Cart"
      const cart = await Cart.findOne({ userId: userId, status: "Cart" });
      if (!cart) {
        return res.json({ msg: "Cart not found." });
      }
  
      // If the cart is empty
      if (cart.items.length === 0) {
        return res.json({ msg: "Cart is empty." });
      }
  
      // Update cart status to "Ordered"
      cart.status = "Ordered";
      await cart.save();
  
      // Process each cart item
      for (const item of cart.items) {
        const product = await productModel.findById(item.productId);
        if (!product) {
          return res.json({ msg: `Product with ID ${item.productId} not found.` });
        }
  
        // Reduce the product quantity
        product.quantity -= item.quantity;
  
        // Check if the stock is sufficient
        if (product.quantity < 0) {
          return res.json({ msg: `Not enough stock for ${product.name}.` });
        }
  
        // Save the updated product quantity
        await product.save();
      }
  
      // Log incoming order data for debugging
      console.log(cartId, userId, deliveryAddress, paymentMethod, cardDetails, totalAmount);
  
      // Create a new order object
      const newOrder = new Order({
        userId: userId,
        cartId: cartId,
        deliveryAddress: deliveryAddress,
        paymentMethod: paymentMethod,
        cardDetails: paymentMethod === "Online" ? cardDetails : null,
        totalAmount: totalAmount,
      });
  
      // Save the new order to the database
      const savedOrder = await newOrder.save();
  
      // Return the order details as a response
      res.status(200).json({
        message: "Order placed successfully",
        orderId: savedOrder._id,
        orderDetails: savedOrder,
      });
  
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ error: "Error processing your order." });
    }
  };
  
  
 const viewOrder=async(req,res)=>{
    try{
       const orders=await Order.find({}).populate("cartId").populate("userId")
       const cart=await Cart.find({status:"Ordered"})
       console.log(orders)
       res.json({orders:orders,cart:cart})
    }catch(err){
        console.log(err)
    }
 } 
  
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status: newStatus } = req.body;

        // Find the order by its ID and update the status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports={registerUser,login,userProfile,viewplacedOrders,addContact,updateProfile,addToCart,viewCart,incrementQuantity,decrementQuantity,removeItem,retailOrder,viewOrder,updateOrderStatus}