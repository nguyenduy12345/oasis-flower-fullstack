import {
  createOrderDB,
  getOrderDB,
  editOrderDB,
} from "../models/order.models.js";

const createOrder = async (req, res) => {
  const { _id } = req.data;
  const { products, totalPrice, shippingAddress, typePayment, discount } =
    req.body;
  try {
    const order = await createOrderDB({
      user: _id,
      products: products.map((product) => {
        return {
          product: product.product._id,
          quantity: product.quantity,
          size: product.size,
          note: product.note,
          accessories: product.accessories,
        };
      }),
      totalPrice,
      shippingAddress,
      typePayment,
      discount,
    });
    res.status(201).send({
      message: "Created order success ",
      order,
    });
  } catch (err) {
    res.status(403).send({
      message: err.message,
    });
  }
};
const getOrder = async (req, res) => {
  const { _id } = req.data;
  try {
    const orderPending = await getOrderDB({
      user: _id,
      status: ["Pending", "Processing", "Cancelled", "Shipping"],
      deleted: false
    }).populate(["products.product", "discount"]).sort({createdAt: -1});
    const orderDelivered = await getOrderDB({
      user: _id,
      status: "Delivered",
    }).populate(["products.product", "discount"]).sort({updatedAt: -1});
    res.status(200).send({
      orderPending,
      orderDelivered,
    });
  } catch (err) {
    res.status(403).send({
      message: err.message, 
    });
  }
};
const getAllOrder = async (req, res) => {
    try {
      const orderPending = await getOrderDB({
        status: ["Pending", "Processing", "Shipping"],
        deleted: false
      }).populate(["user", "products.product", "discount"]);
      const orderDelivered = await getOrderDB({
        status: ["Delivered"],
      }).populate(["user", "products.product", "discount"]).sort({updatedAt: -1});
      res.status(200).send({
        orderPending,
        orderDelivered,
      });
    } catch (err) {
      res.status(403).send({
        message: err.message, 
      });
    }
  };
const handleEditOrderByUser = async (req, res) => {
    const { _id } = req.data
    const { orderId } = req.params
    const { status } = req.body
    try {
      await editOrderDB({
        user: _id,
        _id: orderId
      },{
        status
      })
      res.status(200).send({
        message: `Updated status ${status} success`
      });
    } catch (err) {
      res.status(403).send({
        message: err.message, 
      });
    }
  };
const handleDeleteOrderByUser = async (req, res) => {
    const { _id } = req.data
    const { orderId } = req.params
    const {status} = req.body
    try {
      await editOrderDB({
        user: _id,
        _id: orderId
      },{
        status,
        deleted: true
      })
      res.status(200).send({
        message: `Deleted order success`
      });
    } catch (err) {
      res.status(403).send({
        message: err.message, 
      });
    }
  };
  const handleEditOrderByAdmin = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    try {
      await editOrderDB({
        _id: orderId
      },{
        status
      })
      res.status(200).send({
        message: `Updated status ${status} success`
      });
    } catch (err) {
      res.status(403).send({
        message: err.message, 
      });
    }
  };
  const handleDeleteOrderByAdmin = async (req, res) => {
    const { orderId } = req.params
    const { status } = req.body
    try {
      await editOrderDB({
        _id: orderId
      },{
        status,
        deleted: true
      })
      res.status(200).send({
        message: `Deleted order success`
      });
    } catch (err) {
      res.status(403).send({
        message: err.message, 
      });
    }
  };
export { createOrder, getOrder, getAllOrder, handleEditOrderByUser , handleDeleteOrderByUser, handleEditOrderByAdmin, handleDeleteOrderByAdmin};
