import { memo, useContext} from "react";
import { useTranslation } from "react-i18next";

import { CartProduct, MessageContext} from '/src/stores'
import { CartItem } from '/src/components'

import instance from "../../utils/request.js";

import styles from "./styles.module.scss";

const Cart = ({setIsCart}) => {
  const { cartProduct, setCartProduct } = useContext(CartProduct)
  const { setMessageNotifi } = useContext(MessageContext)
  const {i18n} = useTranslation()
  const total = cartProduct && cartProduct.reduce((init, item) => {
    switch(i18n.language){
      case 'en':
        return init + (+item.quantity * +item.product.priceEN)
      case 'vi':
        return init + (+item.quantity * +item.product.priceVI)
    }
  }, 0) 
  const handleRemoveItemCart = async(id) =>{
    try {
      const result = await instance.delete(`carts?productId=${id}`)
      setMessageNotifi(i18n.language == 'vi' ? 'Bạn đã xóa một sản phẩm' : 'Product removed')
      setTimeout(() => setMessageNotifi(undefined),1000)
      setCartProduct(result.data.products)
    } catch (error) {
      console.log(error)
    }
  }
  const handleMinusQuantity = async(id, quantity) =>{
    if(quantity === 1){
     try {
      const res = await instance.delete(`carts?productId=${id}`)
      setCartProduct(res.data.products)
     } catch (error) {
      console.log(error)
     }
    }else{
      try {
        const res = await instance.patch('carts', {
          productId: id,
          quantity: quantity - 1
        })
        setCartProduct(res.data.products)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const handleAddQuantity = async(id, quantity) =>{
    try {
      const res = await instance.patch('carts', {
        productId: id,
        quantity: quantity + 1
      })
      setCartProduct(res.data.products)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={styles["cart"]}>
      <i
        onClick={() => setIsCart(false)}
        className={`${styles["cart__icon"]} fa-solid fa-xmark`}
      ></i>
      <p className={styles["cart__title"]}>{i18n.language == 'en' ? 'Shopping Cart' : 'Giỏ hàng'}</p>
      <div className={styles["cart__list"]}>
        <ul className={styles["cart__item"]}>
          <li>{i18n.language == 'en' ? 'Name' : 'Tên'}</li>
          <li>{i18n.language == 'en' ? 'Image' : 'Ảnh'}</li>
          <li>{i18n.language == 'en' ? 'Quantity' : 'Số lượng'}</li>
          <li>{i18n.language == 'en' ? 'Price' : 'Giá'}</li>
          <li>{i18n.language == 'en' ? 'Size' : 'Kích cỡ'}</li>
          <li></li>
        </ul>
        <div className={styles["box__item"]}>
          {cartProduct && cartProduct.map((product) => (
              <CartItem 
                key={product.product._id} 
                product={product} 
                handleRemoveItemCart={() => handleRemoveItemCart(product.product._id)} 
                handleMinusQuantity={() => handleMinusQuantity(product.product._id ,product.quantity)}
                handleAddQuantity={() => handleAddQuantity(product.product._id ,product.quantity)}
              />
            ))}
        </div>
      </div>
      <div className={styles["cart__footer"]}>
        <p>{i18n.language == 'en' ? `Total: ${total}$` : `Tổng: ${new Intl.NumberFormat().format(total)} VNĐ` }</p>
        <button className="btn font-weight-semibold">{i18n.language == 'en' ? 'Check Out' : 'Thanh toán' }</button>
      </div>
    </div>
  );
};

export default memo(Cart);
