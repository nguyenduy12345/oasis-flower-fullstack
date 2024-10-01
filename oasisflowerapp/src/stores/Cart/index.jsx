import { createContext, useState, useEffect } from 'react'
import instance, {createAxiosResponseInterceptor} from '../../utils/request.js'

export const CartProduct = createContext({})

const CartProductProvider = ({ children }) => {
  const [cartProduct, setCartProduct] = useState()
    useEffect(() => {
      const fetchCart = async() => {
          const result = await instance.get('/carts')
          setCartProduct(result.data.data.products)
        }
      fetchCart()
    }, [cartProduct])
    return (
    <CartProduct.Provider value={{ cartProduct, setCartProduct }}>
        {children}
    </CartProduct.Provider>
  )
}

export default CartProductProvider
