import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

import { MessageContext } from "/src/stores";
import instance from "../../utils/request.js";

import styles from "./styles.module.scss";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderDelivered, setOrderDelivered] = useState([]);
  const [editOrder, setEditOrder] = useState();
  const { i18n } = useTranslation();
  const { setMessageNotifi } = useContext(MessageContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = searchParams.get("pageNumber");
  useEffect(() => {
    const fetchOrders = async () => {
      await instance
        .get("/orders")
        .then((res) => {
          setOrders(res.data.orderPending);
          setOrderDelivered(res.data.orderDelivered);
        })
        .catch((err) => console.log(err));
    };
    fetchOrders();
  }, [editOrder, pageNumber]);
  const handleCancelOrder = async (id) => {
    await instance
      .patch(`/orders/${id}`, {
        status: "Cancelled",
      })
      .then((res) => {
        setEditOrder("Cancelled" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Bạn đã dừng đặt 1 đơn hàng"
            : "This order was cancelled"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  };

  const handleCountinueOrder = async (id) => {
    await instance
      .patch(`/orders/${id}`, {
        status: "Pending",
      })
      .then((res) => {
        setEditOrder("Pending" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Bạn đã lại đơn hàng thành công"
            : "This order was sent again"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  };
  const handleDeliveredOrder = async (id) => {
    await instance
      .patch(`/orders/${id}`, {
        status: "Delivered",
      })
      .then((res) => {
        setEditOrder("Delivered" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Cảm ơn bạn đã sử dụng sản phẩm của chúng tôi!"
            : "We very happy when you use my products. Thank you so much!"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  };
  const handleRemoveOrder = async (id) => {
    await instance
      .patch(`/orders/delete/${id}`, {
        status: "Deleted",
      })
      .then((res) => {
        setEditOrder("Delete" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Xóa thành công đơn hàng"
            : "Deleted order success"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  };
  const handleVerifyDay = (data) => {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}h${minutes} - ${day}/${month}/${year}`;
  };
  return (
    <>
      <div className={styles["order"]}>
        <ul className={styles["order__link"]}>
          <li>
            <Link to="/home">
              {i18n.language == "en" ? "Home" : "Trang chủ"}
            </Link>
          </li>
          <li>{">"}</li>
          <li>
            <Link to="/cart">
              {i18n.language == "en" ? "Shopping Cart" : "Giỏ hàng"}
            </Link>
          </li>
          <li>{">"}</li>
          <li>
            <Link to="/orders">
              {i18n.language == "en" ? "Orders" : "Danh sách đơn hàng"}
            </Link>
          </li>
        </ul>
        <div className={styles["order__list"]}>
          <h5>
            {i18n.language == "en" ? "My Orders" : "Các đơn hàng của tôi"}
          </h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">{i18n.language == "vi" ? "STT" : "ID"}</th>
                <th scope="col">
                  {i18n.language == "vi" ? "Sản phẩm" : "Products"}
                </th>
                <th scope="col">
                  {i18n.language == "vi" ? "Thanh toán" : "Total Price"}
                </th>
                <th scope="col">
                  {i18n.language == "vi"
                    ? "Địa chỉ nhận hàng"
                    : "Shipping Address"}
                </th>
                <th scope="col">
                  {i18n.language == "vi"
                    ? "Hình thức hanh toán"
                    : "Type Payment"}
                </th>
                <th scope="col">
                  {i18n.language == "vi" ? "Ngày tạo đơn" : "Created At"}
                </th>
                <th scope="col">
                  {i18n.language == "vi" ? "Trang thái đơn hàng" : "Status"}
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {orders
                ? orders.map((item, i) => (
                    <tr key={item._id}>
                      <td>{i}</td>
                      <td scope="row">
                        {item.products.map((product) => (
                          <>
                            <ul key={product._id}>
                              <li>
                                <img
                                  src={product.product.image}
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    float: "left",
                                    marginRight: "20px",
                                  }}
                                />
                              </li>
                              <li>Name: {product.product.name}</li>
                              <li>Quantity: {product.quantity}</li>
                              <li>Size: {product.size}</li>
                            </ul>
                          </>
                        ))}
                      </td>
                      <td>
                        {new Intl.NumberFormat().format(item.totalPrice) +
                          " VNĐ"}
                      </td>
                      <td>{item.shippingAddress}</td>
                      <td>{item.typePayment}</td>
                      <td>{handleVerifyDay(item?.createdAt)}</td>
                      {item.status === "Pending" ? (
                        <td>
                          {item.status}{" "}
                          <button onClick={() => handleCancelOrder(item._id)}>
                            Cancel?
                          </button>
                        </td>
                      ) : item.status === "Cancelled" ? (
                        <td>
                          {item.status}{" "}
                          <button
                            onClick={() => handleCountinueOrder(item._id)}
                          >
                            Countinue?
                          </button>
                        </td>
                      ) : item.status === "Shipping" ? (
                        <td>
                          {item.status}{" "}
                          <button
                            onClick={() => handleDeliveredOrder(item._id)}
                          >
                            Delivered?
                          </button>
                        </td>
                      ) : (
                        <td>{item.status}</td>
                      )}

                      <td>
                        {(item.status === "Shipping") |
                        (item.status === "Processing") ? (
                          ""
                        ) : (
                          <i
                            onClick={() => handleRemoveOrder(item._id)}
                            className="fa-solid fa-trash"
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))
                : []}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles["order__list"]}>
        <h5>
          {i18n.language == "en" ? "Orders Delivered" : "Các đơn hàng đã nhận"}
        </h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">{i18n.language == "vi" ? "STT" : "ID"}</th>
              <th scope="col">
                {i18n.language == "vi" ? "Sản phẩm" : "Products"}
              </th>
              <th scope="col">
                {i18n.language == "vi" ? "Thanh toán" : "Total Price"}
              </th>
              <th scope="col">
                {i18n.language == "vi"
                  ? "Địa chỉ nhận hàng"
                  : "Shipping Address"}
              </th>
              <th scope="col">
                {i18n.language == "vi" ? "Ngày nhận hàng" : "Date of receipt"}
              </th>
              <th scope="col">
                {i18n.language == "vi" ? "Trang thái đơn hàng" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody>
            {orderDelivered
              ? orderDelivered.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i}</td>
                    <td scope="row">
                      {item.products.map((product) => (
                        <>
                          <ul key={product._id}>
                            <li>
                              <img
                                src={product.product.image}
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  float: "left",
                                  marginRight: "20px",
                                }}
                              />
                            </li>
                            <li>Name: {product.product.name}</li>
                            <li>Quantity: {product.quantity}</li>
                            <li>Size: {product.size}</li>
                          </ul>
                        </>
                      ))}
                    </td>
                    <td>
                      {new Intl.NumberFormat().format(item.totalPrice) + " VNĐ"}
                    </td>
                    <td>{item.shippingAddress}</td>
                    <td>{handleVerifyDay(item?.updatedAt)}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              : []}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
