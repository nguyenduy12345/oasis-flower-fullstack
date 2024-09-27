
import { useEffect, useState, memo } from 'react'
import { goToTop } from '/src/functions'
import styles from './styles.module.scss'
const BackToTop = () => {
  const [isBackTop, setIsBackTop] = useState(false)
  useEffect(() => {
    const getScroll = () =>{
      window.scrollY >= 500 ? setIsBackTop(true) : setIsBackTop(false)
    }
    window.addEventListener("scroll", getScroll)
    return () => {
      window.removeEventListener("scroll", getScroll)
    }
  }, [])
  return (
    <>
      {isBackTop && <div onClick={() => goToTop()} id={styles["back_to_top"]}><i className="fa-sharp fa-solid fa-arrow-up"></i></div>}
    </>
  )
}
export default memo(BackToTop)
