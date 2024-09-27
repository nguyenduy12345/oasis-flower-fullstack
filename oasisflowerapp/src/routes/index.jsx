import { About, Accessories, Cakes, Flowers, Home, Occasions, Register } from '/src/pages'
const routes = [
    {path: "/", element: <Home />},
    {path: "/about", element: <About />},
    {path: "/accessories", element: <Accessories />},
    {path: "/cakes", element: <Cakes />},
    {path: "/flowers", element: <Flowers />},
    {path: "/occasions", element: <Occasions />},
    {path: "/regiter", element: <Register />},
]

export default routes