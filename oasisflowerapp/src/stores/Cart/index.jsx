import { createContext, useState, useEffect } from 'react'
import instance  from '../../utils/request.js'

export const CartProduct = createContext({})

const CartProductProvider = ({ children }) => {
  const [cartProduct, setCartProduct] = useState([])
  const [fetchProduct, setFetchProduct] = useState()
  console.log(fetchProduct)
    useEffect(() => {
      const fetchCart = async() => {
          const result = await instance.get('/carts')
          setCartProduct(result.data.data.products)
        }
      fetchCart()
    }, [fetchProduct])
    return (
    <CartProduct.Provider value={{ cartProduct, setCartProduct, setFetchProduct }}>
        {children}
    </CartProduct.Provider>
  )
}

export default CartProductProvider
