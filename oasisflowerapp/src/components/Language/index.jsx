import { useTranslation } from "react-i18next";
import { memo } from "react";
import useLocalStorage from 'use-local-storage'

import styles from './styles.module.scss'
const Language = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useLocalStorage("LANGUAGE", '')
  // useEffect(() =>{
  //   i18n.changeLanguage(lang)
  // }, [ lang ])
  const changeOption = (e) =>{
    switch(e.target.value){
      case '0':
        setLang('vi')
        i18n.changeLanguage('vi')
        break;
      case '1':
        setLang('en')
        i18n.changeLanguage('en')
    }
  }
  return (
       <select onChange={(e) => changeOption(e)} className={`${styles['form__change']} form-select form-select-sm`}>
        <option value='0'>Tiếng Việt</option>
        <option value='1'>English</option>
      </select>
  );
};

export default memo(Language);
