import { createContext, ReactNode, useState } from 'react'

export const CartProduct = createContext({})

const CartProductProvider = ({ children }) => {
    let cartItem = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : []
    const [cartProduct, setCartProduct] = useState(cartItem)
    return (
    <CartProduct.Provider value={{ cartProduct, setCartProduct }}>
        {children}
    </CartProduct.Provider>
  )
}

export default CartProductProvider
