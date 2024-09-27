import { memo, useCallback, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import instance from "../../utils/request.js";

import { debounce } from "/src/functions";
import { Theme, StateLogin } from "/src/stores";
import styles from "./styles.module.scss";

const Profile = () => {
  const { isDark } = useContext(Theme);
  const { i18n } = useTranslation();
  const getLogin = JSON.parse(localStorage.getItem("USER_LOGIN"));
  const [changePassword, setChangePassword] = useState(false);
  const [changeType, setChangeType] = useState(false);
  const [changeTypeNewPass, setChangeTypeNewPass] = useState(false);
  const [crrPassword, setCrrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [changeAvt, setChangeAvt] = useState();
  const [isInfo, setIsInfo] = useState(true);
  const { stateLogin } = useContext(StateLogin);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await instance.get("profile");
        setUser(result.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [stateLogin]);
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
  const handleChangePassword = async() => {
    if(!crrPassword | !newPassword){
      return
    }
    await instance.patch("change-password",{
        password: crrPassword,
        newPassword,
      })
      .then(() => {
        setMessage(
          i18n.language == "vi"
            ? "Lưu thông tin thành công!"
            : "Saved successfully!"
        );
        return
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
  const handleUpdateProfile = () => {
    console.log('done')
  };
  const changeAvatar = useCallback(
    (e) => {
      let file = e.target.files[0];
      let result = URL.createObjectURL(file);
      setChangeAvt(result);
      // const index = getAccountRegister.findIndex(acc => (acc.username == getLogin.username))
      // localStorage.setItem("USER_REGISTER", JSON.stringify([...getAccountRegister, getAccountRegister[index].src = result]))
    },
    [changeAvt]
  );
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
          </ul>
          <ul className={`${styles["profile__infomation"]} col-xs-9 col-sm-9`}>
            <li className={styles["profile__avatar"]}>
              <img
                src={
                  changeAvt
                    ? changeAvt
                    : "/img/profile/default-user-icon-13.jpg"
                }
              />
              <label htmlFor="file_avt">
                {i18n.language == "vi" ? "Thay ảnh đại diện" : "Change avatar"}
                <i className="fa-regular fa-pen-to-square"></i>
              </label>
              <input id="file_avt" type="file" onChange={changeAvatar} />
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
                <button onClick={handleChangePassword}>
                {i18n.language == "vi" ? "Lưu lại" : "Save "}
                  <i className="fa-solid fa-check"></i>
                </button>
                <p className={styles["profile__message"]}>{message}</p>
              </ul>
            )}
            {/* <button onClick={handleUpdateProfile}>
              Save <i className="fa-solid fa-check"></i>
            </button> */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(Profile);
