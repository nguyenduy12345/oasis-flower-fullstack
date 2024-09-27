import { memo } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'
const ErrorPage = () => {
  return (
    <div className={styles["error"]}>
      <p>404 not match <Link to="/home" >Go Home</Link></p>
      <img src="/src/assets/images/img/404/th.jfif" />
    </div>
  )
}

export default memo(ErrorPage)
