import { useRef, useEffect, useState, memo} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import instance from "../../utils/request.js";

import debounce from "../../functions/Debounce"
import styles from "./styles.module.scss";

const Searching = ({setIsSearching}) => {
const { i18n } = useTranslation()
const inputSearch = useRef(null);
const boxSearch = useRef(null);
  useEffect(() => {
    inputSearch.current.focus();
  }, []);
const [searchingProducts, setSearchingProducts] = useState([])
const [dataItem, setDataItem] = useState(null)
const [isIcon, setIsIcon] = useState(false)
const [messageSearch, setMessageSearch] = useState(false)
const [searchParams, setSearchParams] = useSearchParams()
const navigate = useNavigate()
const handleChangeSearching = (e) => {
  if(!e.target.value){
    setSearchParams(false)
    return
  }
  setSearchParams({keyWord: e.target.value})
  }
  const keyWord = searchParams.get('keyWord')
  useEffect(() => {
    const fetchProducts = async() =>{
    setIsIcon(true)
    const productSearching = await instance.get(`products?keyWord=${keyWord}`)
    if(!keyWord){
      boxSearch.current.style.height = "60px"
      setSearchingProducts([])
      setMessageSearch(false)
      setIsIcon(false)
      return
    }
    if(productSearching.data.data.products.length == 0){
      setSearchingProducts([])
      boxSearch.current.style.height = "110px"
      setMessageSearch(true)
      setIsIcon(false)
      return 
    }else{
    boxSearch.current.style.height = "300px";
    setMessageSearch(false)
    setSearchingProducts(productSearching?.data?.data?.products)
    setIsIcon(false)
    }
  }
  fetchProducts()
  },[keyWord])
  const handleGoToProductViewPage = (id) => {
    setSearchParams({ productId: id });
    navigate(`/products?productId=${id}`)
    setIsSearching(false)
  }
  return (
    <>
    <div ref={boxSearch} className={styles["searching"]}>
      <input
        ref={inputSearch}
        onChange={debounce(handleChangeSearching, 200)}
        className={styles["searching__input"]}
        id="searching"
        type="text"
        placeholder={i18n.language == 'vi'? "Tìm kiếm..." : "Searching..."}
      />
      {isIcon ? <i className={`${styles["icon__loading"]} fa-solid fa-spinner`}></i> : <i className="fa-solid fa-magnifying-glass"></i>}
      {messageSearch && <p style={{fontSize:"1.2rem", color: 'red'}}>{i18n.language == 'vi'? 'Không tìm thấy sản phẩm...': "Can't find product..."} </p>}
      <p
        onClick={() => {setIsSearching(false); setSearchParams({})}}
        className={styles["searching__icon"]}
      >
        <i className="fa-solid fa-xmark"></i>
      </p>
      {searchingProducts.map((item) => (
        <ul onClick={() => handleGoToProductViewPage(item._id)} key={item._id} className={`${styles["searching__product"]} mt-2`}>
        <div className={`${styles["searching__img"]} me-2`}>
          <li>
            <img src={item.image} />
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
