import { useRef, useEffect, useState, memo, useCallback} from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ProductView } from '/src/components'
import styles from "./styles.module.scss";

const Searching = ({setIsSearching, products}) => {
const { i18n } = useTranslation()
const inputSearch = useRef(null);
const boxSearch = useRef(null);
  useEffect(() => {
    inputSearch.current.focus();
  }, []);
const [searching, setSearching] = useState([])
const [dataItem, setDataItem] = useState(null)
const [isIcon, setIsIcon] = useState(false)
const [messageSearch, setMessageSearch] = useState(false)
const [searchParams, setSearchParams] = useSearchParams()
let timeOut = null
const handleChangeSearching = useCallback((e) => {
  setIsIcon(true)
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
      let productSearching = products.filter((product) => product.name.toLowerCase().includes(e.target.value.toLowerCase()))
      if(productSearching.length == products.length){
        setSearching([])
        boxSearch.current.style.height = "60px"
        setMessageSearch(false)
      }else if(productSearching.length == 0){
        setMessageSearch(true)
        boxSearch.current.style.height = "110px"
        setSearching([])
      }
      else{
        boxSearch.current.style.height = "300px";
        setMessageSearch(false)
        setSearching(productSearching)
      }
      setIsIcon(false)
    },300)
  }, [])
  const handleSearchingItem = useCallback((item) => {
    setSearchParams({product: `${item.name}`, id: `${item.id}`})
    setDataItem(item)
  }, [])

  return (
    <>
    {dataItem && <ProductView dataItem={dataItem} setDataItem={setDataItem}/>}
    <div ref={boxSearch} className={styles["searching"]}>
      <input
        ref={inputSearch}
        onChange={(e) => handleChangeSearching(e)}
        className={styles["searching__input"]}
        id="searching"
        type="text"
        placeholder={i18n.language == 'vi'? "Tìm kiếm..." : "Searching..."}
      />
      {isIcon == false ? <i className="fa-solid fa-magnifying-glass"></i> : <i className={`${styles["icon__loading"]} fa-solid fa-spinner`}></i>}
      {messageSearch && <p style={{fontSize:"1.2rem", color: 'red'}}>{i18n.language == 'vi'? 'Không tìm thấy sản phẩm...': "Can't find product..."} </p>}
      <p
        onClick={() => setIsSearching(false)}
        className={styles["searching__icon"]}
      >
        <i className="fa-solid fa-xmark"></i>
      </p>
      {searching.map((item) => (
        <ul onClick={() => handleSearchingItem(item)} key={item.id} className={`${styles["searching__product"]} mt-2`}>
        <div className={`${styles["searching__img"]} me-2`}>
          <li>
            <img src={item.src} />
          </li>
        </div>
        <div className={styles["searching__info"]}>
          <li className={styles["searching__name"]}>{item.name}</li>
          <li className={styles["searching__des"]}>{i18n.language == 'vi'? item.desVI: item.desEN}</li>
          <li className={styles["searching__price"]}>
          {i18n.language == 'vi'? "Giá:" : "Price:"} <span>{i18n.language == 'vi'? `${new Intl.NumberFormat().format(item.priceVI)} VNĐ` : `${item.priceEN} $`}</span>
          </li>
        </div>
      </ul>
      )) }
    </div>
    </>
  );
};

export default memo(Searching);
