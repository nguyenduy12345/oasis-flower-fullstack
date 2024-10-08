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
  const { stateLogin, setStateLogin } = useContext(StateLogin);
  const { cartProduct, setCartProduct, setFetchProduct } = useContext(CartProduct);
  const [accountLogin, setAccountLogin ] = useState()
  const [avatarUser, setAvatarUser] = useState()
  const {t} = useTranslation('header')
  const header = useRef();
  const { i18n } = useTranslation();
  useEffect(() => {
    const account = localStorage.getItem("USER_LOGIN") ? JSON.parse(localStorage.getItem("USER_LOGIN")) : ''
    const avatar = localStorage.getItem("USER_AVATAR") ? JSON.parse(localStorage.getItem("USER_AVATAR")) : ''
    setAccountLogin(account)
    setAvatarUser(avatar)
  }, [stateLogin])
  const cartLength = cartProduct ? cartProduct.reduce((init, item) => init + +item.quantity, 0) : ''
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
      setStateLogin('logout success');
      setFetchProduct([])
      localStorage.removeItem("CART");
      localStorage.removeItem("USER_LOGIN")
      localStorage.removeItem("USER_AVATAR")
      localStorage.removeItem("ACCESS_TOKEN")
      localStorage.removeItem("REFRESH_TOKEN")
  },[])
  return (
    <>
      {isLogin && <LoginForm setIsLogin={setIsLogin} setForgotPassword={setForgotPassword} />}
      {forgotPassword && <ForgotPassword setIsLogin={setIsLogin} setForgotPassword={setForgotPassword} /> }
      <header ref={header} data-theme={isDark ? 'dark' : 'light'}>
        {isSearching && (
          <Searching setIsSearching={setIsSearching} />
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
                {avatarUser ? 
                  <img src={avatarUser} style={{width: "40px", height:"40px", borderRadius:"50%"}} />
                : accountLogin ? 
                  <p>{accountLogin}</p>
                 : 
                  <i className="fa-solid fa-user"></i>
                }
                <i className={`${styles["icon_up"]} fa-solid fa-caret-up`}></i>
                <div className={styles["user"]}>
                  {accountLogin ? (
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
                  onClick={() =>{setIsCart(!isCart); setIsSearching(false)}}
                  className="fa-solid fa-cart-shopping"
                ></i>
                {isCart && <Cart setIsCart={setIsCart} />}
                <p id="cart_length_large" className={styles["cart_length"]}>
                  {cartLength ? cartLength : 0}
                </p>
              </li>
            </ul>
          </div>
          {/* NAVBAR - Small Screen */}
          {isNavSmall && (
            <ul className={styles["header__nav--small"]}>
              <i
                onClick={() => setIsNavSmall(false)}
                className={`${styles["icon__close"]} fa-solid fa-xmark`}
              />
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/home"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.home')}</li>
              </NavLink>
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/products/flowers"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-1')}</li>
              </NavLink>
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/products/cakes"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-2')}</li>
              </NavLink>
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/products/accessories"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-3')}</li>
              </NavLink>
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/occasions"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-4')}</li>
              </NavLink>
              <NavLink
                onClick={() => setIsNavSmall(false)}
                to="/about"
                className={({ isActive }) => (isActive ? activeLink : "")}
              >
                <li className={styles["nav__item"]}>{t('nav.nav-5')}</li>
              </NavLink>
              <li><Language /></li>
              <li className={styles["nav__item"]}>{i18n.language == 'vi' ? 'Tài khoản' : 'User'}</li>
              <li className={styles["nav__item"]}>{i18n.language == 'vi' ? 'Tìm kiếm' : 'Searching'}</li>
            </ul>
          )}
          {/* NAVBAR - Big screen */}
          <ul className={styles["header__navbar_list"]}>
            <li className={styles["header__nav"]}>
              <NavLink
                to="/products/flowers"
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
                to="/products/cakes"
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
                to="/products/accessories"
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
