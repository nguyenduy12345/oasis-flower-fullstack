import { Routes, Route} from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layout
import { Header, Footer, MessageNotification } from './components'
// import { About, Accessories, Cakes, Flowers, Home, Occasions, Register, ErrorPage, Profile } from "./pages"
import  {Contact, BackToTop} from './components'
import { ScrollToTop } from './components'

const About = lazy(() => import('./pages/About'))
const Accessories = lazy(() => import('./pages/Accessories'))
const Cakes = lazy(() => import('./pages/Cakes'))
const Flowers = lazy(() => import('./pages/Flowers'))
const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/Register'))
const ErrorPage = lazy(() => import('/src/pages/ErrorPage'))
const Occasions = lazy(() => import('./pages/Occasions'))
const Profile = lazy(() => import('./pages/Profile'))


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
          <Route path='/accessories' element={<Accessories />} />
          <Route path='/accessories/:name' element={<Accessories />} />
          <Route path='/cakes' element={<Cakes />} />
          <Route path='/cakes/:name' element={<Cakes />} />
          <Route path='/flowers' element={<Flowers />} />
          <Route path='/about' element={<About />} />
          <Route path='/occasions' element={<Occasions />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
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
