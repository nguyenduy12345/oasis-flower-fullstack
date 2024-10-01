import { memo, useContext, useState } from 'react'
import { useTranslation } from "react-i18next";

import { Theme } from '/src/stores'
import ChatApp from '../ChatApp';
import styles from './styles.module.scss'

const Contact = () => {
  const {i18n} = useTranslation()
  const { isDark } = useContext(Theme)
  const [isChat, setIsChat] = useState(false)
  return (
    <div className={styles["contact"]} data-theme={isDark ? 'dark' : 'light'}>
        {isChat && <ChatApp setIsChat={setIsChat}/>}
        <div className={styles["contact__icon"]}>
            <a href="tel:0989999999"><i className="fa-solid fa-phone"></i></a>
        </div>
        <div onClick={() => setIsChat(true)} className={styles["contact__icon"]}>
            <i className="fa-brands fa-facebook-messenger"></i>
            <p className={styles['question']}>{i18n.language == 'vi'? "Bạn cần tôi giúp gì?" : "Can i help you?"}</p>
        </div>
        <div className={styles["contact__icon"]}> 
            <a href="mailto:oasisflower@gmail.com"><i className="fa-solid fa-envelope"></i> </a>  
        </div>       
    </div>
  )
}

export default memo(Contact);
