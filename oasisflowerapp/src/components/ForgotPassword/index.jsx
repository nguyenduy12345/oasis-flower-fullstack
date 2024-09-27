import { Link } from "react-router-dom";
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
import { debounce } from "/src/functions";
import styles from "./styles.module.scss";
import { StateLogin, MessageContext } from "/src/stores";

const ForgotPassword = ({setIsLogin, setForgotPassword}) => {
  const { i18n } = useTranslation()
  const [email, setEmail] = useState()
  const [message, setMessage] = useState(i18n.language == 'vi' ? 'Nhập email của bạn để lấy lại mật khẩu.' : 'Please enter your email.')
  const inputEmail = useRef(null);
  const handleGetValueInputEmail = (e) =>{
    setEmail(e.target.value)
  }
  useEffect(() => {
    inputEmail.current.focus();
  }, []);
  const closeLoginForm = () =>{
    setForgotPassword(false)
  }
  const handleSubmitForm = async () => {
    if(!email) {
      setMessage(i18n.language == 'vi' ? 'Vui lòng nhập email của bạn.' : 'Email is required.')
    }
    await instance.post('forgot-password', {email})
    .then(() => {
      setMessage(i18n.language == 'vi' ? 'Mật khẩu mới đã được gửi vào Email của bạn' : 'Please check your new password in gmail message')
      setTimeout(() => {
        setForgotPassword(false)
      }, 4000)
      setIsLogin(true)
    })
    .catch(() => {
      setMessage(i18n.language == 'vi' ? 'Email này không tồn tại' : 'Email is not exist')
    })
  }
  const handleForgotPassword = () => {
    
  }
  return (
    <div className={styles["box__login"]}>
      <div className={styles["form"]}>
        <div className={styles["form__title"]}>{i18n.language == 'vi'? 'Quên mật khẩu' : 'Forget password'}</div>
        <FormControl
          ref={inputEmail}
          className={styles["form__input"]}
          variant="outlined">
          <InputLabel 
            htmlFor="outlined-adornment-email">
            Email
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email" 
            label="Username"
            onChange={debounce(handleGetValueInputEmail, 200)} 
          />
        </FormControl>
        <button onClick={handleSubmitForm} className={styles["btn__login"]}>{i18n.language == 'vi'? 'Lấy mật khẩu mới' :'Get new password' }</button>
        <p className={styles["form__message"]}>{message}</p>
        <p onClick={closeLoginForm} className={styles["close__login"]}>
          <i className="fa-solid fa-xmark"></i>
        </p>
      </div>
    </div>
  );
};

export default memo(ForgotPassword);
