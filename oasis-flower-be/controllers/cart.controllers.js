import CartModel, {
  getCartDB,
  updateCartDB,
  deleteCartDB,
} from "../models/cart.models.js";
// Phương thức để tính toán tổng tiền của giỏ hàng
// cartSchema.methods.calculateTotal = function () {
//     let total = 0;
//     this.items.forEach((item) => {
//       total += item.product.price * item.quantity;
//     });
//     this.total = total;
//     return total;
//   };
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
  const { productId } = req.body
  try {
    let cart = await getCartDB({ user: _id });
    if(!cart){
        const newCart = new CartModel({ user: _id });
        await newCart.save()
    }
    cart = await getCartDB({ user: _id });
    const productIndex = cart?.products.findIndex((item) => item.product._id.toString() === productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
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

// Cập nhật số lượng sản phẩm trong giỏ hàng
const handleUpdateCart = async (req, res) => {
  const { _id } = req.data
  const { productId } = req.body
  try {
    const cart = await getCartDB({ user: _id });
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity;
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

// Xóa sản phẩm khỏi giỏ hàng
const handleDeleteCart = async (req, res) => {
  const { _id } = req.data
  const { productId } = req.query
  try {
    const cart = await getCartDB({ user: _id });
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
