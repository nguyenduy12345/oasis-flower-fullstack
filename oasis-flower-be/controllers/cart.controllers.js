import CartModel, {
  getCartDB
} from "../models/cart.models.js";
const handleGetCart = async (req, res) => {
  const { _id } = req.data
  try {
    const cart = await getCartDB({ user: _id }).populate(
      "products.product"
    );
    if(!cart) throw new Error("Cart not exist")
    res.status(200).send({
        data: cart
    });
  } catch (err) {
    res.status(403).send({ 
        message: err.message 
    });
  }
}
const handleAddCart = async (req, res) => {
  const { _id } = req.data
  const { productId, quantity, size, note, accessories} = req.body
  try {
    let cart = await getCartDB({ user: _id }).populate(
      "products.product"
    );
    if(!cart){
        const newCart = new CartModel({ user: _id });
        await newCart.save()
    }
    cart = await getCartDB({ user: _id });
    const productIndex = cart?.products.findIndex((item) => item.product._id.toString() === productId);
    if (productIndex !== -1) {
       cart.products[productIndex].quantity = quantity;
       cart.products[productIndex].size = size
       cart.products[productIndex].note = note
       cart.products[productIndex].accessories = accessories
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
        size,
        note,
        accessories
      });
    }
    await cart.save();
    res.status(201).send({
        message: "Add success",
        cart
    });
  } catch (err) {
    res.status(403).send({ 
        message: err.message 
    });
  }
};

const handleUpdateCart = async (req, res) => {
  const { _id } = req.data
  const { productId, quantity } = req.body
  try {
    const cart = await getCartDB({ user: _id }).populate(
      "products.product"
    );;
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      return res.status(404).send({ 
        message: "Sản phẩm không tồn tại trong giỏ hàng" 
    });
    }
    await cart.save();
    res.status(201).send({
        cart
    });
  } catch (err) {
    res.status(403).send({ 
        message: err.message 
    });
  }
};
const handleDeleteCart = async (req, res) => {
  const { _id } = req.data
  const { productId } = req.query
  try {
    const cart = await getCartDB({ user: _id }).populate(
      "products.product"
    );
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
    }else{
      return res.status(404).send({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
    }
    await cart.save();
    res.status(201).send({
        cart
    });
  } catch (err) {
    res.status(403).send({ 
        message: err.message 
    });
  }
};

export {handleGetCart, handleAddCart, handleUpdateCart, handleDeleteCart};
