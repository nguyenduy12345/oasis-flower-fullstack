import { useSearchParams, useNavigate } from "react-router-dom";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import instance from "../../utils/request.js";
import { goToTop } from "/src/functions";
import { CartProduct, MessageContext } from "/src/stores";
import { LoginForm } from "/src/components";

import styles from "./styles.module.scss";

const ProductView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataItem, setDataItem] = useState([]);
  const accountLogin = localStorage.getItem("USER_LOGIN")
    ? JSON.parse(localStorage.getItem("USER_LOGIN"))
    : null;
  const { setCartProduct, setFetchProduct } = useContext(CartProduct);
  const [getImage, setGetImage] = useState();
  const [getSize, setGetSize] = useState("S");
  const [inputNote, setInputNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isMessage, setIsMessage] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [activeSize, setActiveSize] = useState();
  const [productOther, setProductOther] = useState([]);
  const { setMessageNotifi } = useContext(MessageContext);
  const navigate = useNavigate();
  const listSize = ["S", "M", "L"];
  const bigImg = useRef();
  const zoomImg = useRef();
  const { t, i18n } = useTranslation("productview");
  const productId = searchParams.get("productId");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const getProduct = await instance.get(
          `products?productId=${productId}`
        );
        setDataItem(getProduct.data?.product[0]);
        const getProductOther = await instance.get(
          `products/${getProduct.data?.product[0].product}`
        );
        const productOtherList = [];
        const numbers = [];
        while (numbers.length < 8) {
          let randomNumber = Math.floor(Math.random() * getProductOther?.data?.data?.length);
          if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
          }
        }
        for (let i = 0; i < numbers.length; i++) {
          productOtherList.push(getProductOther?.data?.data[numbers[i]]);
        }
        setProductOther(productOtherList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [productId]);
  const handleSetDataItem = (item) => {
    setSearchParams({ productId: item._id });
    navigate(`/products?productId=${item._id}`);
    goToTop();
  };
  const handleMinusQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      return;
    }
  }, [quantity]);
  const handleAddQuantity = useCallback(() => {
    setQuantity(quantity + 1);
    return;
  }, [quantity]);
  // Toggle button Size
  const handleToggleSize = (e) => {
    e.preventDefault();
    setGetSize(e.target.id);
    setActiveSize(e.target.id);
  };
  const handleAddCart = async () => {
    if (accountLogin) {
      try {
        await instance.post("carts", {
          productId: dataItem._id,
          quantity,
          size: getSize,
          note: inputNote,
        });
        setFetchProduct({
          productId: dataItem._id,
          quantity,
          size: getSize,
          note: inputNote,
        });
        setMessageNotifi(
          i18n.language == "vi"
            ? "Thêm giỏ hàng thành công"
            : "Added product successfully"
        );
        setTimeout(() => {
          setMessageNotifi(undefined);
        }, 1000);
        setIsMessage(false);
      } catch (error) {
        setMessageNotifi(error.response.data.message);
        setTimeout(() => {
          setMessageNotifi(undefined);
        }, 1000);
      }
    } else {
      setIsMessage(true);
      setIsLogin(true);
      setMessageNotifi(
        i18n.language == "vi" ? "Vui lòng đăng nhập!" : "Please login!"
      );
      setTimeout(() => {
        setMessageNotifi(undefined);
      }, 1000);
      setSearchParams("");
      clearTimeout(timeout);
      let timeout = setTimeout(() => setIsMessage(false), 10000);
    }
  };
  const handleBuyNow = async () => {
    if (accountLogin) {
      try {
        await instance.post("carts", {
          productId: dataItem._id,
          quantity,
          size: getSize,
          note: inputNote,
        });
        setFetchProduct({
          productId: dataItem._id,
          quantity,
          size: getSize,
          note: inputNote,
        });
        setIsMessage(false);
        navigate("/cart");
      } catch (error) {
        setMessageNotifi(error.response.data.message);
        setTimeout(() => {
          setMessageNotifi(undefined);
        }, 1000);
      }
    } else {
      setIsMessage(true);
      setIsLogin(true);
      setMessageNotifi(
        i18n.language == "vi" ? "Vui lòng đăng nhập!" : "Please login!"
      );
      setTimeout(() => {
        setMessageNotifi(undefined);
      }, 1000);
      setSearchParams("");
      clearTimeout(timeout);
      let timeout = setTimeout(() => setIsMessage(false), 10000);
    }
  };
  // Zoom img
  const changeZoomUp = (event) => {
    zoomImg.current.style.opacity = 1;
    zoomImg.current.style.zIndex = 99;
    // GET POSITION ZOOM IMG
    let positionElementX =
      event.screenX - bigImg.current.getBoundingClientRect().left;
    let positionMouseX = (positionElementX / bigImg.current.offsetWidth) * 100;
    let positionElementY =
      event.screenY - bigImg.current.getBoundingClientRect().top;
    let positionMouseY = (positionElementY / bigImg.current.offsetHeight) * 100;
    // // SET POSITION ZOOM IMG
    zoomImg.current.style.setProperty("--zoom-x", `${positionMouseX}%`);
    zoomImg.current.style.setProperty("--zoom-y", `${positionMouseY}%`);
    // // SET TRANSFORM ZOOM IMG
    let translateX = -(positionMouseX - 50) / 2.5;
    let translateY = -(positionMouseY - 50) / 2.5;
    zoomImg.current.style.transform = `scale(1.9) translate(${translateX}% , ${translateY}%)`;
  };
  const changeZoomDown = () => {
    zoomImg.current.style.opacity = 0;
    zoomImg.current.style.transform = `scale(0)`;
  };
  return (
    <>
      {isLogin && <LoginForm setIsLogin={setIsLogin} />}
      <div className={`${styles["product"]} row mt-3`}>
        <div className={`${styles["product__image"]} col-sm-12 col-lg-5`}>
          <div className={styles["product__image--big"]}>
            <img
              onMouseMove={changeZoomUp}
              ref={bigImg}
              loading="lazy"
              src={getImage || dataItem?.image}
            />
            <img
              onMouseOut={changeZoomDown}
              ref={zoomImg}
              loading="lazy"
              src={getImage || dataItem?.image}
            />
          </div>
          <ul className={styles["product__image--small"]}>
            <li>
              <img
                onClick={(e) => setGetImage(e.target.src)}
                loading="lazy"
                src={dataItem?.image}
              />
            </li>
            <li>
              <img
                onClick={(e) => setGetImage(e.target.src)}
                loading="lazy"
                src="/img/flower/tulips/mixed_tulip.JPG"
              />
            </li>
            <li>
              <img
                onClick={(e) => setGetImage(e.target.src)}
                loading="lazy"
                src="/img/flower/roses/spring_mixed_rose.jpg"
              />
            </li>
          </ul>
        </div>
        <div className={`${styles["attribute"]} col-sm-12 col-lg-7`}>
          <h4 className={styles["attribute__name"]}>{dataItem.name}</h4>
          <p className={styles["attribute__des"]}>
            {i18n.language == "en" ? dataItem?.desEN : dataItem?.desVI}
          </p>
          <span className={styles["attribute__title"]}>{t("price")}</span>
          <span className={styles["attribute__price"]}>{`${
            i18n.language == "en"
              ? `${+dataItem?.priceEN * quantity}$`
              : `${new Intl.NumberFormat().format(
                  +dataItem?.priceVI * quantity
                )} VNĐ`
          }`}</span>
          <br />
          <span className={styles["attribute__title"]}>{t("quantity")}</span>
          <ul className={styles["attribute__quantity"]}>
            <li>
              <i
                onClick={handleMinusQuantity}
                className="fa-solid fa-minus"
              ></i>
            </li>
            <li>
              <input
                type="text"
                onChange={(e) => setQuantity(+e.target.value)}
                value={quantity}
              />
            </li>
            <li>
              <i onClick={handleAddQuantity} className="fa-solid fa-plus"></i>
            </li>
          </ul>
          <span className={styles["attribute__title"]}>{t("size")}</span>
          <ul className={styles["size"]}>
            {listSize.map((size) => (
              <li
                onClick={handleToggleSize}
                key={size}
                className={
                  getSize === size
                    ? styles["size__option--active"]
                    : styles["size__option"]
                }
                id={size}
              >
                {size}
              </li>
            ))}
          </ul>
          {/* <div className={styles["accessories"]}>
            <span className={styles["attribute__title"]}>
              {t("accessories")}
            </span>
            <ul>
              <li className={styles["accessories__item"]}>
                <img
                  loading="lazy"
                  src="/img/accessories/binh-ve-hoa-sen-1579078281135761213270.webp"
                />
              </li>
              <li className={styles["accessories__item"]}>
                <img
                  loading="lazy"
                  src="/img/accessories/img_60f8e56b8eebc.jpg"
                />
              </li>
              <li className={styles["accessories__item"]}>
                <img loading="lazy" src="/img/accessories/boxgift.webp" />
              </li>
            </ul>
          </div> */}
          <span className={styles["attribute__title"]}>{t("notes")} </span>
          <input
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            className={styles["product__note"]}
            type="text"
            name="write_note"
            placeholder={t("notes-input")}
          />
          <ul className={styles["product__function"]}>
            <li onClick={handleAddCart}>{t("button")}</li>
            <li onClick={handleBuyNow}>
              {i18n.language == "vi" ? "Mua Ngay" : "Buy Now"}
            </li>
          </ul>
          {isMessage && (
            <p className={styles["product__message"]}>{t("message")}</p>
          )}
          <p className="message_add_cart"></p>
        </div>
      </div>
      <div className={`${styles["product__other"]} row`}>
        <h5>
          {i18n.language == "vi" ? "Các sản phẩm tương tự" : "Products Other"}
        </h5>
        {productOther &&
          productOther.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSetDataItem(item)}
              className={`${styles["item"]} col-sm-6 col-md-4 col-lg-3`}
            >
              <div className={styles["image"]}>
                <img loading="lazy" src={item?.image} />
              </div>
              <div className={styles["description"]}>
                <div className={styles["title"]}>{item?.name}</div>
                <div className={`${styles["text"]} pt-2`}>
                  {i18n.language == "en" ? item?.desEN : item?.desVI}
                </div>
                <div className={styles["price"]}>
                  <span>
                    {i18n.language == "en"
                      ? `Price: ${item?.priceEN} $ `
                      : `Giá: ${new Intl.NumberFormat().format(
                          +item?.priceVI
                        )} VNĐ`}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default memo(ProductView);
