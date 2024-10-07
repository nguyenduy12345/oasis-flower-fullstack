import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { MessageContext } from "/src/stores";
import instance from "../../utils/request.js";

import styles from "./styles.module.scss";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [orderDelivered, setOrderDelivered] = useState([]);
  const [editOrder, setEditOrder] = useState();
  const { i18n } = useTranslation();
  const { setMessageNotifi } = useContext(MessageContext);
  useEffect(() => {
    const fetchOrders = async () => {
      await instance
        .get("/orders-all")
        .then((res) => {
          setOrders(res.data.orderPending);
          setOrderDelivered(res.data.orderDelivered);
        })
        .catch((err) => console.log(err));
    };
    fetchOrders();
  }, [editOrder]);
  const handleProcessingOrder = async(id) => {
    await instance
      .patch(`/orders/admin/${id}`, {
        status: "Processing",
      })
      .then((res) => {
        setEditOrder("Processing" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Cập nhật trang thái đơn hàng thành công"
            : "Updated status order success"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  }
  const handleShippingOrder = async(id) => {
    await instance
      .patch(`/orders/admin/${id}`, {
        status: "Shipping",
      })
      .then((res) => {
        setEditOrder("Shipping" + id);
        setMessageNotifi(
          i18n.language == "vi"
            ? "Cập nhật trang thái đơn hàng thành công"
            : "Updated status order success"
        );
        setTimeout(() => setMessageNotifi(undefined), 1000);
      })
      .catch((err) => {
        setMessageNotifi(err.response.data.message);
        setTimeout(() => setMessageNotifi(undefined), 1000);
      });
  }
  const handleVerifyDay = (data) => {
  const date = new Date(data)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return(`${hours}h${minutes} - ${day}/${month}/${year}`)
  }
  return (
    <>
      <div className={styles["order"]}>
        <div className={styles["order__menu"]}>
          <Link to="/admin/products?pageNumber=1&pageSize=15">Products</Link>
          <Link to="/admin/users?pageNumber=1&pageSize=15">Users</Link>
          <Link to="/admin/orders?pageNumber=1&pageSize=15">Orders</Link>
          <Link to="/admin/discount?pageNumber=1&pageSize=15">
            Discount Code
          </Link>
        </div>
        <div className={styles["order__container"]}>
            <h5>
              {i18n.language == "en" ? "List Orders Pending" : "Các đơn hàng đang chờ xử lý"}
            </h5>
          <div className={styles["order__list"]}>
            
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">{i18n.language == "vi" ? 'STT' : 'ID'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Sản phẩm' : 'Products'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Thông tin người nhận' : 'User'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Địa chỉ nhận hàng' : 'Shipping Address'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Mã giảm giá' : 'Discount'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Thanh toán' : 'Total Price'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Hình thức hanh toán' : 'Type Payment'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Ngày tạo đơn' : 'Created At'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Trang thái đơn hàng' : 'Status'}</th>
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
                              <ul key={product._id} style={{paddingLeft: '0px'}}>
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
                        <td>{
                          <ul style={{paddingLeft: '0px'}}>
                            <li>Name: {item.user.username}</li>
                            <li>Email: {item.user.email}</li>
                            <li>Phone: {item.user.phonenumber}</li>
                          </ul>
                          }</td>
                        <td>{item.shippingAddress}</td>
                        <td>{
                          <ul style={{paddingLeft: '0px'}}>
                            <li>Code: {item.discount ? item.discount.code : ''}</li>
                            <li>Discount: {item.discount ? item.discount.discount : ''} %</li>
                            </ul>}</td>
                        <td>
                          {new Intl.NumberFormat().format(item.totalPrice) +
                            " VNĐ"}
                        </td>
                        <td>{item.typePayment}</td>
                        <td>{handleVerifyDay(item?.createdAt)}</td>
                        {item.status === "Pending" ? (
                          <td>
                            {item.status}{" "}
                            <button onClick={() => handleProcessingOrder(item._id)}>
                              Processing?
                            </button>
                          </td>
                        ) : item.status === "Processing" ? (
                          <td>
                            {item.status}{" "}
                            <button
                              onClick={() => handleShippingOrder(item._id)}
                            >
                              Shipping?
                            </button>
                          </td>
                        ) : item.status}
                      </tr>
                    ))
                  : []}
              </tbody>
            </table>
          </div>
          <h5>
            {i18n.language == "en"
              ? "Orders Delivered "
              : "Các đơn hàng giao thành công"}
          </h5>
          <div className={styles["order__list"]}>
          
          <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">{i18n.language == "vi" ? 'STT' : 'ID'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Sản phẩm' : 'Products'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Thông tin người nhận' : 'User'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Địa chỉ nhận hàng' : 'Shipping Address'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Mã giảm giá' : 'Discount'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Thanh toán' : 'Total Price'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Hình thức hanh toán' : 'Type Payment'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Ngày nhận hàng' : 'Date of receipt'}</th>
                  <th scope="col">{i18n.language == "vi" ? 'Trang thái đơn hàng' : 'Status'}</th>
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
                              <ul key={product._id} style={{paddingLeft: '0px'}}>
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
                        <td>{
                          <ul style={{paddingLeft: '0px'}}>
                            <li>Name: {item.user.username}</li>
                            <li>Email: {item.user.email}</li>
                            <li>Phone: {item.user.phonenumber}</li>
                          </ul>
                          }</td>
                        <td>{item.shippingAddress}</td>
                        <td>{
                          <ul style={{paddingLeft: '0px'}}>
                            <li>Code: {item.discount ? item.discount.code : ''}</li>
                            <li>Discount: {item.discount ? item.discount.discount : 0} %</li>
                            </ul>}</td>
                        <td>
                          {new Intl.NumberFormat().format(item.totalPrice) +
                            " VNĐ"}
                        </td>
                        <td>{item.typePayment}</td>
                        <td>{handleVerifyDay(item.updatedAt)}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))
                  : []}
              </tbody>
            </table>
        </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrder;
