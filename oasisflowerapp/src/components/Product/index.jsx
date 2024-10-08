import { memo } from 'react'
import { useSearchParams, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from "./styles.module.scss";

const Product = ({ item, styleList}) => {
  const {i18n} = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const handleSetDataItem = () => {
    setSearchParams({productId: item._id})
    navigate(`/products?productId=${item._id}`)
  }
  return (
    <div
      onClick = {handleSetDataItem}
      className={styleList == 'list' ? `${styles["product__item"]} col-sm-12 col-md-6 col-lg-4 pe-md-1` : `${styles["product__item--row"]}`}
    >
      <div className={styles["product__image"]}>
        <img loading="lazy" src={item.image} />
        <div className={`${styles["product__view"]} text-uppercase`}>
          <i className="fa-solid fa-eye me-2"></i>View
        </div>
      </div>
      <div className={styles["description"]}>
        <div className={styles["description__title"]}>{item.name}</div>
        <div className={`${styles["description__text"]} pt-2`}>{i18n.language == 'en' ? item.desEN : item.desVI}</div>
        <div className={styles["description__price"]}>{`${i18n.language == 'en' ? `Price: ${item.priceEN} $ ` : `Giá: ${new Intl.NumberFormat().format(+item.priceVI)} VNĐ`} `}</div>
      </div>
    </div>
  );
};

export default memo(Product);
