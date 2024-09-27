import {
  useState,
  memo,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  LoginForm,
  Searching,
  Notifications,
  Cart,
  Language,
  DarkMode,
  Weather,
  ForgotPassword
} from "/src/components";

import { StateLogin, CartProduct, Theme } from "/src/stores";

import products from "/src/assets/data";
import styles from "./styles.module.scss";

const activeLink = "text-danger";

const Header = () => {
  const { isDark } = useContext(Theme)
  const [isLogin, setIsLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false)
  const [isSearching, setIsSearching] = useState(false);
  const [isNotifi, setIsNotifi] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [isNavSmall, setIsNavSmall] = useState(false);
  const [userNameLogin, setUserNameLogin] = useState()
  const { setStateLogin } = useContext(StateLogin);
  const accountLogin = localStorage.getItem("USER_LOGIN") ? JSON.parse(localStorage.getItem("USER_LOGIN")) : ''
  const { cartProduct, setCartProduct } = useContext(CartProduct);
  const {t} = useTranslation('header')
  const header = useRef();
  const cartLength = useMemo(() =>{
      return cartProduct.reduce(
        (init, item) => init + +item.quantity,
        0
      )},
    [cartProduct]
  );
  const setPosition = useCallback(() => {
    window.scrollY >= 100
      ? (header.current.style.position = "fixed")
      : (header.current.style.position = "relative"),
      (header.current.style.top = "0"),
      (header.current.style.left = "0");
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", setPosition);
    return () => {
      window.removeEventListener("scroll", setPosition);
    };
  }, []);
  const handleLogOut = useCallback(() => {
    setIsLogin(true);
    setStateLogin(false);
    setCartProduct([])
    setUserNameLogin(false)
    localStorage.removeItem("CART");
  },[accountLogin]);
  return (
    <>
      {isLogin && <LoginForm setIsLogin={setIsLogin} setForgotPassword={setForgotPassword} setUserNameLogin={setUserNameLogin} />}
      {forgotPassword && <ForgotPassword setIsLogin={setIsLogin} setForgotPassword={setForgotPassword} /> }
      <header ref={header} data-theme={isDark ? 'dark' : 'light'}>
        {isSearching && (
          <Searching products={products} setIsSearching={setIsSearching} />
        )}
        <div className={styles["header__navbar"]}>
          <div className={styles["header__category--mode"]}>
            <Language />
            <DarkMode />
            <Weather />
          </div>
          <div className={styles["header__firstline"]}>
            <i
              onClick={() => setIsNavSmall(!isNavSmall)}
              className={`${styles["header__icon"]} fa-sharp fa-solid fa-bars`}
            ></i>
            {isNotifi && <Notifications />}
            <div className={styles["logo"]}>
              <NavLink to="/home">Floral Oasis</NavLink>
            </div>
            <ul className={styles["header__list_icon"]}>
              <li
                onClick={() => setIsSearching(!isSearching)}
                className={styles["icon_searching"]}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </li>
              <li className="" onClick={() => setIsNotifi(!isNotifi)}>
                <i className="fa-solid fa-bell"></i>
                <span className={styles["notifi__length"]}>0</span>
              </li>
              <li className={styles["icon_user"]}>
                {userNameLogin ? 
                  <p>{userNameLogin}</p>
                 : 
                  <i className="fa-solid fa-user"></i>
                }
                <i className={`${styles["icon_up"]} fa-solid fa-caret-up`}></i>
                <div className={styles["user"]}>
                  {userNameLogin ? (
                    <ul className={styles["box_user"]}>
                      <li onClick={handleLogOut}>{t('icon.user-next.logout')}</li>
                      <li>
                        <NavLink to="/profile">{t('icon.user-next.profile')}</NavLink>
                      </li>
                    </ul>
                  ) : (
                    <ul className={styles["box_user"]}>
                      <li onClick={() => setIsLogin(true)}>{t('icon.user-prev.login')}</li>
                      <li>
                        <NavLink to="/register">{t('icon.user-prev.register')}</NavLink>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              <li className={styles["icon_cart"]}>
                <i
                  onClick={() => setIsCart(!isCart)}
                  className="fa-solid fa-cart-shopping"
                ></i>
                {isCart && <Cart setIsCart={setIsCart} />}
                <p id="cart_length_large" className={styles["cart_length"]}>
                  {cartLength ? cartLength : 0}
                </p>
              </li>
            </ul>
          </div>
          {isNavSmall && (
            <ul className={styles["header__nav--small"]}>
              <i
                onClick={() => setIsNavSmall(false)}
                className={`${styles["icon__close"]} fa-solid fa-xmark`}
              />
              <NavLink
                to="/home"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.home')}</li>
              </NavLink>
              <NavLink
                to="/flowers"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-1')}</li>
              </NavLink>
              <NavLink
                to="/cakes"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-2')}</li>
              </NavLink>
              <NavLink
                to="/accessories"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-3')}</li>
              </NavLink>
              <NavLink
                to="/occasions"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-4')}</li>
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-5')}</li>
              </NavLink>
              <ul><li><Language /></li>
              <li><DarkMode /></li>
              <li><Weather /></li></ul>
              
              <li className={styles["nav__item"]}>User</li>
              <li className={styles["nav__item"]}>Searching</li>
            </ul>
          )}
          <ul className={styles["header__navbar_list"]}>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/flowers"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                {t('nav.nav-1')}
              </NavLink>
              <ul className={styles["nav_flowers"]}>
                <li>
                  <a href="">roses</a>
                </li>
                <li>
                  <a href="">ranunculus</a>
                </li>
                <li>
                  <a href="">sunflowers</a>
                </li>
                <li>
                  <a href="">hydrangea</a>
                </li>
                <li>
                  <a href="">carnations</a>
                </li>
                <li>
                  <a href="">tulips</a>
                </li>
              </ul>
            </li>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/cakes"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                {t('nav.nav-2')}
              </NavLink>
              <ul className={styles["nav_cakes"]}>
                <li>
                  <a href="">truffles</a>
                </li>
                <li>
                  <a href="">cookies</a>
                </li>
                <li>
                  <a href="">cupcakes</a>
                </li>
                <li>
                  <a href="">cream cakes</a>
                </li>
              </ul>
            </li>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/accessories"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
               {t('nav.nav-3')}
              </NavLink>
              <ul className={styles["nav_accessories"]}>
                <li>
                  <a href="">gift wrap</a>
                </li>
                <li>
                  <a href="">gift box</a>
                </li>
                <li>
                  <a href="">handmades</a>
                </li>
              </ul>
            </li>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/occasions"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
               {t('nav.nav-4')}
              </NavLink>
              <ul className={styles["nav_occasions"]}>
                <li>
                  <a href="">wedding</a>
                </li>
                <li>
                  <a href="">wirthday</a>
                </li>
                <li>
                  <a href="">wnniversary</a>
                </li>
                <li>
                  <a href="">wother’s day</a>
                </li>
                <li>
                  <a href="">weacher’s day</a>
                </li>
              </ul>
            </li>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                {t('nav.nav-5')}
              </NavLink>
            </li>
            <div className={styles["header__box_white"]}></div>
          </ul>
        </div>
      </header>
    </>
  );
};

export default memo(Header);
