import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useEffect, useCallback, useState, useContext, memo} from "react";
import { useTranslation } from "react-i18next";

import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";

import instance from "../../utils/request.js";
import { goToTop, debounce } from "/src/functions";
import styles from "./styles.module.scss";
import { StateLogin, MessageContext } from "/src/stores";

const LoginForm = ({ setIsLogin, setForgotPassword}) => {
  const { i18n } = useTranslation()
  const [account, setAccount] = useState({username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  const [messageLogin, setMessageLogin] = useState('')
  const { setStateLogin } = useContext(StateLogin)
  const { setMessageNotifi } = useContext(MessageContext)
  const inputName = useRef(null);
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const handleGetValueInputName = (e) =>{
    setAccount({...account,username: e.target.value})
  }
  const handleGetValueInputPassword = (e) =>{
    setAccount({...account,password: e.target.value})
  }
  useEffect(() => {
    inputName.current.focus();
  }, []);
  const handleCloseLoginForm = useCallback(() => {
    setIsLogin(false);
    goToTop();
  }, []);
  const closeLoginForm = () =>{
    setIsLogin(false)
  }
  const handleClickShowPassword = useCallback(() => setShowPassword((show) => !show), []);
  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, [])
  const handleSubmitForm = async () =>{
    await instance.post('login', account)
    .then((result) => {
      setStateLogin('login success')
      localStorage.setItem("ACCESS_TOKEN", JSON.stringify(result.data.data.user.accesstoken))
      localStorage.setItem("REFRESH_TOKEN", JSON.stringify(result.data.data.user.refreshtoken))
      localStorage.setItem('USER_LOGIN', JSON.stringify(account.username))
      localStorage.setItem('USER_AVATAR', JSON.stringify(!!result.data.data.user.avatar ? result.data.data.user.avatar : ''))
      setMessageNotifi(i18n.language == 'vi' ? 'Đăng nhập thành công' : 'Logged in successfully')
      setTimeout(() =>{setMessageNotifi(undefined)},1000)
      setMessageLogin(i18n.language == 'vi'? 'Đăng nhập thành công' :'LOGIN SUCCESS')
      setTimeout(() => setIsLogin(false), 500)
      if(result.data.data.user.role.includes('admin') ){
        navigate("/admin/products?pageNumber=1&pageSize=15")
        window.location.href = 'https://oasis-flower-frontend.onrender.com/admin/products?pageNumber=1&pageSize=15'
        return
      }
      window.location.href = 'https://oasis-flower-frontend.onrender.com'
    })
    .catch(error => {
      if (error.response) {
        setMessageLogin(error.response.data.message)
        return 
      } else {
        setMessageLogin(error.message)
        return
      }
    })
  }
  const handleForgotPassword = () => {
    setForgotPassword(true)
    setIsLogin(false)
  }
  return (
    <div className={styles["box__login"]}>
      <div className={styles["form"]}>
        <div className={styles["form__title"]}>{i18n.language == 'vi'? 'Đăng nhập' :'Customer Login'}</div>
        <FormControl
          className={styles["form__input"]}
          variant="outlined">
          <InputLabel 
            ref={inputName} 
            htmlFor="outlined-adornment-username">
            {i18n.language == 'vi'? 'Tài khoản' :'Username' }
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-username" 
            label="Username"
            onChange={debounce(handleGetValueInputName, 200)} 
          />
        </FormControl>
        <FormControl 
          className={styles["form__input"]}
          variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
          {i18n.language == 'vi'? 'Mật khẩu' :'Password' }
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={debounce(handleGetValueInputPassword, 200)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <button onClick={handleSubmitForm} className={styles["btn__login"]}>{i18n.language == 'vi'? 'Gửi' :'Login' }</button>
        <p className={styles["form__message"]}>{messageLogin}</p>
        <p className="fw-light">
          {i18n.language == 'vi'? 'Bạn chưa có tài khoản?' : "Don't have an account?" }
          <Link onClick={handleCloseLoginForm} to="/register">
            {i18n.language == 'vi'? 'Đăng ký' : "Register" }
          </Link>
        </p>
        <p className="fw-light">
        <Link onClick={handleForgotPassword}>
          {i18n.language == 'vi'? 'Quên mật khẩu?' : "Forgot password?" }
        </Link>
        </p>
        <p onClick={closeLoginForm} className={styles["close__login"]}>
          <i className="fa-solid fa-xmark"></i>
        </p>
      </div>
    </div>
  );
};

export default memo(LoginForm);
