import { Routes, Route} from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layout
import { Header, Footer, MessageNotification} from './components'
import  {Contact, BackToTop} from './components'
import { ScrollToTop } from './components'

const About = lazy(() => import('./pages/About'))
const Products = lazy(() => import('./pages/Products'))
const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/Register'))
const ErrorPage = lazy(() => import('/src/pages/ErrorPage'))
const Occasions = lazy(() => import('./pages/Occasions'))
const Profile = lazy(() => import('./pages/Profile'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Orders = lazy(() => import('./pages/OrdersPage'))
const ProductView = lazy(() => import('./pages/ProductView'))
const AdminProduct = lazy(() => import('./pages/AdminProduct'))
const AdminUser = lazy(() => import('./pages/AdminUser'))
const AdminDiscount = lazy(() => import('./pages/AdminDiscount'))
const AdminOrder = lazy(() => import('./pages/AdminOrder'))


import { StyleViewProvider, StateLoginProvider, CartProductProvider, ThemeProvider, MessageContextProvider } from './stores';

function App() {
  return (
    <> 
    <Suspense fallback={<p>Loading...</p>}>
      <ThemeProvider> 
      <StateLoginProvider>
      <MessageContextProvider>
      <CartProductProvider>
      <StyleViewProvider>
      <ScrollToTop />
      <MessageNotification />
      <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path="/products">
            <Route path=':productName' element={<Products />} />
            <Route path='' element={<ProductView />} />
          </Route>
          <Route path='/about' element={<About />} />
          <Route path='/occasions' element={<Occasions />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/orders' element={<Orders />} />
          <Route path="/admin">
            <Route path='products' element={<AdminProduct />} />
            <Route path='users' element={<AdminUser />} />
            <Route path='discount' element={<AdminDiscount />} />
            <Route path='orders' element={<AdminOrder />} />
          </Route>
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      <Footer />
      <Contact />
      <BackToTop />
      </StyleViewProvider>
      </CartProductProvider>
      </MessageContextProvider>
      </StateLoginProvider>
      </ThemeProvider>
    </Suspense>
    </>
  )
}

export default App
