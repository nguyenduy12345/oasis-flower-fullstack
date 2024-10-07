import { memo, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
// import FormData from 'form-data'

import instance, {
  createAxiosResponseInterceptor,
} from "../../utils/request.js";

import { debounce } from "/src/functions";
import { Theme, StateLogin, MessageContext } from "/src/stores";
import styles from "./styles.module.scss";

const Profile = () => {
  const { isDark } = useContext(Theme);
  const { i18n } = useTranslation();
  const getLogin = JSON.parse(localStorage.getItem("USER_LOGIN"));
  const [isAdmin, setIsAdmin] = useState(false)
  const [changePassword, setChangePassword] = useState(false);
  const [changeType, setChangeType] = useState(false);
  const [changeTypeNewPass, setChangeTypeNewPass] = useState(false);
  const [crrPassword, setCrrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [changeAvt, setChangeAvt] = useState();
  const [avatar, setAvatar] = useState()
  const [isInfo, setIsInfo] = useState(true);
  const { setStateLogin } = useContext(StateLogin);
  const { setMessageNotifi } = useContext(MessageContext)
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: "",
    email: "",
    phonenumber: "",
    address: ''
  });
  // GET PROFILE
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await instance.get("profile");
        setUser(result?.data?.user);
        localStorage.setItem('USER_AVATAR', JSON.stringify(result.data.user.avatar))
        if(result?.data?.user.role.includes('admin')){
          setIsAdmin(true)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const changeCrrPass = (e) => {
    setCrrPassword(e.target.value);
  };

  const changeNewPass = (e) => {
    setNewPassword(e.target.value);
  };

  const openEditPassword = () => {
    setChangePassword(true);
    setIsInfo(false);
  };

  const openInfomation = () => {
    setChangePassword(false);
    setIsInfo(true);
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (!crrPassword | !newPassword) {
      setMessage(
        i18n.language == "vi"
          ? "Nhập mật khẩu của bạn"
          : "Enter your password"
      );
      return;
    }
    await instance
      .patch("change-password", {
        password: crrPassword,
        newPassword,
      })
      .then(() => {
        setMessage(
          i18n.language == "vi"
            ? "Lưu thông tin thành công!"
            : "Saved successfully!"
        );
        return;
      })
      .catch((error) => {
        if (error.response) {
          setMessage(
            i18n.language == "vi"
              ? "Mật khẩu không chính xác"
              : "Password is wrong"
          );
          return;
        } else {
          setMessage(error.message);
          return;
        }
      });
  };

  // PREVIEW CHANGE AVATAR
  const changeAvatar = (e) => {
    e.preventDefault()
    let file = e.target.files[0];
    let result = URL.createObjectURL(file);
    setChangeAvt(result);
    setAvatar(file)
  }

  // SAVE AVATAR
  const handleSaveAvatar = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('file', avatar)
    await instance.patch('change-avatar', formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      }
    })
    .then((res) => {
      localStorage.setItem('USER_AVATAR', JSON.stringify(res.data.avatar))
      setStateLogin('change avatar')
      setMessageNotifi(i18n.language == "vi" ? "Thay đổi thành công ảnh đại diện" : "Change avatar success")
      setTimeout(() => setMessageNotifi(false),1000)
    })
    .catch(err => console.log(err))
  };
  return (
    <div
      className={styles["wrapper__profile"]}
      data-theme={isDark ? "dark" : "light"}
    >
      {getLogin && (
        <div className={`${styles["profile"]} row`} onClick={(e) => {}}>
          <ul className={`${styles["profile__action"]} col-xs-3 col-sm-3`}>
            <li onClick={() => openInfomation()}>
              {i18n.language == "vi" ? "Thông tin của bạn" : "Your Info"}
            </li>
            <li onClick={() => openEditPassword()}>
              {i18n.language == "vi" ? "Thay đổi mật khẩu" : "Change Password"}
            </li>
            <li>
              <Link to="/orders?pageNumber=1&pageSize=15">
              {i18n.language == "vi" ? "Đơn hàng" : "Orders"}
              </Link>
            </li>
            {isAdmin && <li>
              <Link to="/admin/products?pageNumber=1&pageSize=15" >
                {i18n.language == "vi" ? "Trang quản lý" : "Admin page"}
              </Link>
            </li> }
          </ul>
          <ul className={`${styles["profile__infomation"]} col-xs-9 col-sm-9`}>
            <li className={styles["profile__avatar"]}>
              <img
                src={
                  changeAvt
                    ? changeAvt :
                    user?.avatar ? user?.avatar
                    : "/img/profile/default-user-icon-13.jpg"
                }
              />
            <label htmlFor="file_avt">
                {i18n.language == "vi" ? "Thay ảnh đại diện" : "Change avatar"}
                <i className="fa-regular fa-pen-to-square"></i>
              </label>
              <input id="file_avt" type="file" onChange={changeAvatar} />
              <button
                onClick={handleSaveAvatar}
                className={styles["save__avt"]}
              >
                {i18n.language == "vi" ? "Lưu ảnh" : "Save avatar"}
              </button>
            </li>
            {isInfo && (
              <>
                <li>
                  <label>
                    {i18n.language == "vi" ? "Tên tài khoản" : "Username"}
                  </label>{" "}
                  <br />
                  <i className="fa-solid fa-user"></i>
                  <input readOnly value={user?.username} />
                </li>
                <li>
                  <label>Email</label>
                  <br />
                  <i className="fa-solid fa-envelope"></i>
                  <input readOnly value={user?.email} />
                </li>
                <li>
                  <label>
                    {i18n.language == "vi" ? "Số điện thoại" : "Phonenumber"}
                  </label>
                  <br />
                  <i className="fa-solid fa-phone"></i>
                  <input readOnly value={user?.phonenumber} />
                </li>
                <li>
                  <label>
                    {i18n.language == "vi" ? "Địa chỉ" : "Address"}
                  </label>
                  <br />
                  <i className="fa-solid fa-location-dot"></i>
                  <input readOnly value={user?.address} />
                </li>
              </>
            )}
            {changePassword && (
              <ul className={`${styles["profile__password--new"]}`}>
                <li>
                  <label>
                    {i18n.language == "vi" ? "Mật khẩu" : "Your password"}
                  </label>
                  <br />
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={changeType ? "text" : "password"}
                    onChange={debounce(changeCrrPass, 500)}
                  />
                  {changeType ? (
                    <i
                      id={styles["change-type"]}
                      onClick={() => setChangeType(false)}
                      className="fa-solid fa-eye-slash"
                    ></i>
                  ) : (
                    <i
                      id={styles["change-type"]}
                      onClick={() => setChangeType(true)}
                      className="fa-solid fa-eye"
                    ></i>
                  )}
                </li>
                <li>
                  <label>
                    {i18n.language == "vi" ? "Mật khẩu mới" : "New password"}
                  </label>
                  <br />
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type={changeTypeNewPass ? "text" : "password"}
                    onChange={debounce(changeNewPass, 500)}
                  />
                  {changeTypeNewPass ? (
                    <i
                      id={styles["change-type"]}
                      onClick={() => setChangeTypeNewPass(false)}
                      className="fa-solid fa-eye-slash"
                    ></i>
                  ) : (
                    <i
                      id={styles["change-type"]}
                      onClick={() => setChangeTypeNewPass(true)}
                      className="fa-solid fa-eye"
                    ></i>
                  )}
                </li>
                <div  onClick={handleChangePassword} className={styles["profile__save"]}>
                  {i18n.language == "vi" ? "Lưu lại" : "Save "}
                  <i className="fa-solid fa-check"></i>
                </div>
                <p className={styles["profile__message"]}>{message}</p>
              </ul>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(Profile);
