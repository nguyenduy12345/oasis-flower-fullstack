import { memo, useCallback, useContext, useMemo} from "react";
import { useTranslation } from "react-i18next";
import { CartProduct, MessageContext} from '/src/stores'
import { CartItem } from '/src/components'

import styles from "./styles.module.scss";

const Cart = ({setIsCart}) => {
  let cartItem = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : []
  const { cartProduct, setCartProduct } = useContext(CartProduct)
  const { setMessageNotifi } = useContext(MessageContext)
  const {i18n} = useTranslation()
  const total = useMemo(() => cartItem.reduce((init, item) => {
    switch(i18n.language){
      case 'en':
        return init + (+item.quantity * +item.defaultPriceEN)
      case 'vi':
        return init + (+item.quantity * +item.defaultPriceVI)
    }
    
  }, 0) , [cartItem])
  // const total = useMemo(() => cartItem.reduce((init: number, item: CartProduct) => , 0), [cartProduct])
  let timeout = null
  const handleRemoveItemCart = useCallback((id) =>{
    setMessageNotifi(i18n.language == 'vi' ? 'Bạn đã xóa một sản phẩm' : 'Product removed')
    clearTimeout(timeout)
    timeout = setTimeout(() => setMessageNotifi(undefined),1000)
    const result = cartItem.filter(item => item.id != id)
    setCartProduct(result)
    localStorage.setItem("CART", JSON.stringify(result))
  }, [cartItem])

  const handleMinusQuantity = useCallback((product, quantity) =>{
    if(quantity === 1 ){
      const crrCartProduct = cartProduct.filter(item => item.id != product.id)
      setCartProduct(crrCartProduct)
      localStorage.setItem("CART", JSON.stringify(crrCartProduct))
    }else{
      const index = cartItem.findIndex(item => item == product)
      cartItem[index] = {...product, 'quantity': +cartItem[index]['quantity'] - 1}
      setCartProduct(cartItem)
      localStorage.setItem("CART", JSON.stringify(cartItem))
    }
  }, [cartItem])

  const handleAddQuantity = useCallback((product) =>{
    const index = cartItem.findIndex(item => item == product)
    cartItem[index] = {...product, 'quantity': +cartItem[index]['quantity'] + 1}
    setCartProduct(cartItem)
    localStorage.setItem("CART", JSON.stringify(cartItem))
  },[cartItem])
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
          {cartItem &&
            cartItem.length > 0 &&
            cartItem.map((product) => (
              <CartItem 
                key={product.id} 
                product={product} 
                handleRemoveItemCart={() => handleRemoveItemCart(product.id)} 
                handleMinusQuantity={() => handleMinusQuantity(product, product.quantity)}
                handleAddQuantity={() => handleAddQuantity(product)}
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
