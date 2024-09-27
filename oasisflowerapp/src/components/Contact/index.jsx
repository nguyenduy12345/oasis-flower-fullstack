import { memo, useContext } from 'react'

import { Theme } from '/src/stores'
import styles from './styles.module.scss'
const Contact = () => {
  const { isDark } = useContext(Theme)
  return (
    <div className={styles["contact"]} data-theme={isDark ? 'dark' : 'light'}>
        <div className={styles["contact__icon"]}>
            <a href="tel:0989999999"><i className="fa-solid fa-phone"></i></a>
        </div>
        <div className={styles["contact__icon"]}>
            <i className="fa-brands fa-facebook-messenger"></i>
        </div>
        <div className={styles["contact__icon"]}> 
            <a href="mailto:oasisflower@gmail.com"><i className="fa-solid fa-envelope"></i> </a>  
        </div>       
    </div>
  )
}

export default memo(Contact);
