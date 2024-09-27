import { useContext, memo } from 'react';

import { Theme } from '/src/stores'
import styles from './styles.module.scss'

const DarkMode = () => {
  const { isDark, setIsDark } = useContext(Theme)
  const changeDarkMode = () =>{
    setIsDark(!isDark)
    isDark ? localStorage.setItem("DARK_MODE", JSON.stringify(false)) : localStorage.setItem("DARK_MODE", JSON.stringify(true)) 
  }
  return (
      <div className={styles['mode']} data-theme={isDark ? 'dark' : 'light'}>
        <i  className={`${styles["mode__icon"]} fa-solid fa-sun`}></i>
        <input onChange={changeDarkMode} checked={isDark} type="checkbox" className={styles["checkbox"]} id="checkbox" />
        <label htmlFor="checkbox" className={styles["checkbox-label"]}>
          <i className={`${styles["fa-moon"]} fas `}></i>
          <i className={`${styles["fa-sun"]} fas `}></i>
          <span className={styles["ball"]}></span>
        </label>
        <i className={`${styles["mode__icon"]} fa-solid fa-moon`}></i>
      </div>
  );
};

export default memo(DarkMode);
