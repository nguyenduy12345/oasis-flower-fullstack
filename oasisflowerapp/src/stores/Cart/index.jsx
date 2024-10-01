import { createContext, useState, useEffect } from 'react'
import instance, {createAxiosResponseInterceptor} from '../../utils/request.js'

export const CartProduct = createContext({})

const CartProductProvider = ({ children }) => {
    useEffect(() => {
      const fetchCart = async() => {
            createAxiosResponseInterceptor()
            const result = await instance.get('cart')
            console.log(result)
          }
    })
    let cartItem = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : []
    // useEffect(() => {
    //   const fetchCart = async() => {
    //     createAxiosResponseInterceptor()
    //     await instance.patch
    //   }

    // },[cartItem])
    const [cartProduct, setCartProduct] = useState(cartItem)
    return (
    <CartProduct.Provider value={{ cartProduct, setCartProduct }}>
        {children}
    </CartProduct.Provider>
  )
}

export default CartProductProvider
