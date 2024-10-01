import { useTranslation } from 'react-i18next';
import { memo } from 'react';

import styles from './styles.module.scss'


const CartItem = ({product, handleAddQuantity, handleMinusQuantity, handleRemoveItemCart}) => {
  const { i18n } = useTranslation()
  return (
    <ul className={styles["cart__item"]}>
      <li>{product.name}</li>
      <li>
        <img src={product.src} />
      </li>
      <li>
        <button className={styles['icon']} onClick={handleMinusQuantity}>-</button>
        <span className={styles['quantity']}>{product.quantity}</span>
        <button className={styles['icon']} onClick={handleAddQuantity}>+</button>
      </li>
      <li>{`${i18n.language == 'en' ? `${+product.quantity * +product.defaultPriceEN}$` : `${new Intl.NumberFormat().format((+product.quantity * +product.defaultPriceVI))}VNĐ`}` }</li>
      <li>{product.size}</li>
      <li>
        <i
          onClick={handleRemoveItemCart}
          className="fa-solid fa-trash"
        ></i>
      </li>
    </ul>
  );
};

export default memo(CartItem)
