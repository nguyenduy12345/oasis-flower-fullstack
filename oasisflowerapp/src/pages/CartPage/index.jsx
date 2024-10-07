import { useContext, useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { CartProduct, MessageContext } from "/src/stores";
import instance from "../../utils/request.js";

import styles from "./styles.module.scss";

const Cart = () => {
  const { cartProduct, setFetchProduct } = useContext(CartProduct);
  const { setMessageNotifi } = useContext(MessageContext);
  const [message, setMessage] = useState()
  const { i18n } = useTranslation();
  const checkOut = useRef()
  const [listProduct, setListProduct] = useState([]);
  const [discount, setDiscount] = useState(0)
  const [code, setCode] = useState()
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phonenumber: '',
    address: ''
  })
  const [typePayment, setTypePayment] = useState('COD')
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async() => {
      const result = await instance.get("profile");
      const {username, email, phonenumber, address} = result.data.user
      setUserInfo({username, email, phonenumber, address})
    }
    fetchUserInfo()
  },[])
  // CSS for box checkout
  // const setPosition = () => {
  //   window.scrollY >= 300
  //     ? ( (checkOut.current.style.position = "fixed"),
  //     (checkOut.current.style.top = "180px"),
  //     (checkOut.current.style.right = "40px"))
  //     : (checkOut.current.style.position = "static")
  // }
  // useEffect(() => {
  //   window.addEventListener("scroll", setPosition);
  //   return () => {
  //     window.removeEventListener("scroll", setPosition);
  //   };
  // }, []);
  // Total price
  const total =
    listProduct &&
    listProduct.reduce((init, item) => {
      switch (i18n.language) {
        case "en":
          return init + +item.quantity * +item?.product?.priceEN;
        case "vi":
          return init + +item.quantity * +item?.product?.priceVI;
      }
    }, 0);
  // Total price payment
  const totalPayment = total - (total / 100 * (+discount.discount ? +discount.discount : 0) )
  const handleAddToCheckOut = (item) => {
    const findIndex =
      listProduct &&
      listProduct.findIndex((product) => product._id === item._id);
    if (findIndex === -1) {
      setListProduct([...listProduct, item]);
      return;
    } else {
      setListProduct(listProduct.filter((product) => product._id !== item._id));
      return;
    }
  };
  // Remove product cart
  const handleRemoveItemCart = async (item, id) => {
    try {
      await instance.delete(`carts?productId=${id}`);
      setMessageNotifi(
        i18n.language == "vi" ? "Bạn đã xóa một sản phẩm" : "Product removed"
      );
      setTimeout(() => setMessageNotifi(undefined), 1000);
      setFetchProduct(id)
      const findIndex =
          listProduct &&
          listProduct.findIndex((product) => product._id === item._id);
        if (findIndex > -1) {
          setListProduct(listProduct.filter(product => product._id !== item._id))
          return;
        }
    } catch (error) {
      console.log(error);
    }
  };
  // Minus quantity product cart
  const handleMinusQuantity = async (item, id, quantity) => {
    try {
      if (quantity === 1) {
        const res = await instance.delete(`carts?productId=${id}`);
        setFetchProduct(res.data.products);
        const findIndex =
          listProduct &&
          listProduct.findIndex((product) => product._id === item._id);
        if (findIndex > -1) {
          setListProduct(listProduct.filter(product => product._id !== item._id))
          return;
        }
      } else {
        const res = await instance.patch("carts", {
          productId: id,
          quantity: quantity - 1,
        });
        setFetchProduct(quantity--);
        const findIndex =
          listProduct &&
          listProduct.findIndex((product) => product._id === item._id);
        if (findIndex > -1) {
          setListProduct(res.data.cart.products.filter(product => listProduct.find(item => product._id === item._id)));
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Add quantity product cart
  const handleAddQuantity = async (item, id, quantity) => {
    try {
      const res = await instance.patch("carts", {
        productId: id,
        quantity: quantity + 1,
      });
      setFetchProduct(quantity++);
      const findIndex =
        listProduct &&
        listProduct.findIndex((product) => product._id === item._id);
      if (findIndex > -1) {
        setListProduct(res.data.cart.products.filter(product => listProduct.find(item => product._id === item._id)));
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Check discount code
  const handleCheckDiscount = async(e) => {
    e.preventDefault()
    await instance.get(`/discount-code?code=${code}`)
      .then((res) => {
        setMessage(res.data.message)
        setDiscount(res?.data?.code)
      })
      .catch((err) => {
        setDiscount(0)
        setMessage(err.response.data.message)
      })
  }
  const handleSelectAllProduct = () => {
    const result = cartProduct?.filter(item => listProduct.find(product => product?.product?._id !== item?.product?._id ))
    console.log(result)
    setListProduct(result)
  }
  // Send order
  const handleCreateOrder = async() =>{
    await instance.post('/orders', {
      products: listProduct,
      typePayment,
      totalPrice: totalPayment,
      shippingAddress: userInfo.address,
      discount: discount._id
    })
    .then((res) => {
      setMessageNotifi(
        i18n.language == "vi" ? "Tạo đơn hàng thành công" : "Created order success"
      );
      setTimeout(() => {
        setMessageNotifi(false)
      }, 1000);
      setSearchParams({pageNumber : 1, pageSize: 15})
      navigate('/orders?pageNumber=1&pageSize=15')
    })
    .catch(err => {
      setMessageNotifi(
        i18n.language == "vi" ? "Tạo đơn hàng thất bại, vui lòng kiểm tra lại!" : "Create order failed, please checking again!"
      );
      setTimeout(() => {
        setMessageNotifi(false)
      }, 1000);
    })
  }
  return ( 
    <>
      <ul className={styles["cart__link"]}>
        <li>
          <Link to="/">{i18n.language == "en" ? "Home" : "Trang chủ"}</Link>
        </li>
        <li>{">"}</li>
        <li>
          <Link to="/cart">
            {i18n.language == "en" ? "Shopping Cart" : "Giỏ hàng"}
          </Link>
        </li>
      </ul>
      <div className={`${styles["cart"]} row`}>
      <h5>{i18n.language == "en" ? "Shopping Cart" : "Giỏ hàng"}</h5>
        <div className={`${styles["cart__list"]} col-xs-12 col-sm-12 col-lg-8`}>
          {/* <input onChange={handleSelectAllProduct} type="checkbox" className={styles["select-all"]} id="select-all"/> <label className={styles["select-all"]} htmlFor="select-all">Select all {cartProduct.length} products </label> */}
          {cartProduct.length > 0 ? (
            cartProduct.map((item) => (
              <ul key={item.product._id} className={`${styles["cart__item"]}`}>
                <input
                  type="checkbox"
                  onChange={() => handleAddToCheckOut(item)}
                />
                <li>
                  <img src={item.product.image} />
                </li>
                <li>
                  <p className={styles["name"]}>{item.product.name}</p>
                  <p className={styles["attribute"]}>
                    {i18n.language == "en" ? "Quantity: " : "Số lượng: "}
                    <i
                      onClick={() =>
                        handleMinusQuantity(
                          item,
                          item.product._id,
                          item.quantity
                        )
                      }
                      className="fa-solid fa-minus"
                    ></i>
                    <span>{item.quantity}</span>
                    <i
                      onClick={() =>
                        handleAddQuantity(item, item.product._id, item.quantity)
                      }
                      className="fa-solid fa-plus"
                    ></i>
                  </p>
                  <p className={styles["attribute"]}>
                    {i18n.language == "en" ? "Size: " : "Kích cỡ: "}
                    <span>{item.size}</span>
                  </p>
                  <p className={styles["attribute"]}>
                    {i18n.language == "en"
                      ? "Price Default: "
                      : "Giá Niêm Yết: "}{" "}
                    <span>
                      {i18n.language == "en"
                        ? item.product.priceEN + " $"
                        : new Intl.NumberFormat().format(item.product.priceVI) +
                          " VNĐ"}{" "}
                    </span>
                  </p>
                  <p className={styles["attribute"]}>
                    {i18n.language == "en" ? "Total Price: " : "Thành tiền: "}{" "}
                    <span>
                      {i18n.language == "en"
                        ? +item.quantity * +item.product.priceEN + " $"
                        : new Intl.NumberFormat().format(
                            +item.quantity * +item.product.priceVI
                          ) + " VNĐ"}{" "}
                    </span>
                  </p>
                  <p className={styles["attribute"]}>
                    {i18n.language == "en" ? "Note: " : "Ghi chú: "}{" "}
                    <span>{item.note}</span>
                  </p>
                  <p className={styles['attribute']}>
                    {i18n.language == "en" ? "Accessories: " : "Các phụ kiện: "}
                  </p>
                  <ul className={styles["accessories"]}>
                  {item.accessories &&
                    item.accessories.map((item, index) => (
                        <li key={index}>
                          <img src={item.image}/>
                        </li>
                      ))}
                    </ul>
                </li>
                <i
                  onClick={() => handleRemoveItemCart(item, item.product._id)}
                  id={styles["remove"]}
                  className="fa-solid fa-trash"
                ></i>
              </ul>
            ))
          ) : (
            <p style={{ fontSize: "1.2rem", color: "red", fontWeight: "bold" }}>
              {i18n.language == "en" ? "Cart is emty" : "Không có sản phẩm nào trong giỏ hàng"}
            </p>
          )}
        </div>
        <div
          ref={checkOut}
          className={`${styles["cart__checkout"]} col-xs-12 col-sm-12 col-lg-4`}
        >
          <p className={styles["title"]}>{i18n.language == "en" ? "Proceed Checkout" : "Thanh Toán"}</p>
          <div style={{ padding: "0 30px 0 30px" }}>
            <input
              onChange={(e) => setCode(e.target.value)}
              value={code}
              type="text"
              placeholder={i18n.language == "en" ? "Discount code" : "Mã giảm giá"}
              className={styles["discount"]}
            />
            <button onClick={handleCheckDiscount}>{i18n.language == "en" ? "Apply" : "Áp dụng"}</button>
            {message && <p style={{color: 'red'}}>{message}</p>}
            <ul>
              <li>{i18n.language == "en" ? "Total:" : "Tổng tiền: "}</li>
              <li>
                {i18n.language == "en"
                  ? total + " $"
                  : new Intl.NumberFormat().format(total) + " VNĐ"}
              </li>
            </ul>
            <ul>
              <li>{i18n.language == "en" ? "Discount:" : "Giảm giá:"}</li>
              <li>{+discount.discount ? +discount.discount : 0} %</li>
            </ul>
            <ul>
              <li>{i18n.language == "en" ? "Total Payment:" : "Tổng tiền cần thanh toán:"}</li>
              <li>{i18n.language == "en"
                  ? totalPayment + " $"
                  : new Intl.NumberFormat().format(totalPayment) + " VNĐ"}</li>
            </ul>
            <ul>
              <p>{i18n.language == "en" ? "Payment type:" : "Chọn loại thanh toán:"}</p>
              <form action="">
                <label htmlFor="COD">
                <input onChange={(e) => setTypePayment(e.target.id)} checked={typePayment === "COD" ? true : ''} type="checkbox" id="COD" name='payment'/>
                {i18n.language == "en" ? "COD (Cash On Delivery)" : "COD (Thanh toán khi nhận hàng)"}</label>
                <label htmlFor="banking">
                <input onChange={(e) => setTypePayment(e.target.id)} checked={typePayment === "Banking" ? true : ''} type="checkbox" id="Banking" name='payment'/>
                {i18n.language == "en" ? "Banking Payment" : "Chuyển khoản trực tiếp qua ngân hàng"}</label>
              </form>
            </ul>
          </div>
          <div onClick={handleCreateOrder} className={styles["cart__checkout--action"]}>{i18n.language == "en" ? "Send Order" : "Đặt đơn hàng"}</div>
        </div>
      </div>
      <div className={styles["cart__info"]}>
        <h5>{i18n.language == "en" ? "My Information" : "Thông tin của tôi"}</h5>
        <label htmlFor="username">{i18n.language == "en" ? "Username:" : "Tên: "}</label>
        <input onChange={(e) => setUserInfo({...userInfo, username: e.target.value})} value={userInfo.username} id='username'/><br/>
        <label htmlFor="email">{i18n.language == "en" ? "Email:" : "Email:"}</label>
        <input onChange={(e) => setUserInfo({...userInfo, email: e.target.value})} value={userInfo.email} id='email'/><br/>
        <label htmlFor="phonenumber">{i18n.language == "en" ? "Phonenumber:" : "Số điện thoại:"}</label>
        <input onChange={(e) => setUserInfo({...userInfo, phonenumber: e.target.value})} value={userInfo.phonenumber} id='phonenumber'/><br/>
        <label htmlFor="address">{i18n.language == "en" ? "Address:" : "Địa chỉ nhận hàng:"}</label>
        <input onChange={(e) => setUserInfo({...userInfo, address: e.target.value})} value={userInfo.address}  id='address'/>
      </div>
    </>
  );
};

export default Cart;
