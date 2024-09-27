
import {memo} from 'react'
import styles from './styles.module.scss'
const Notifications = () => {
  return (
    <div className={styles["notifi"]}>
        <ul className={styles["notifi__wrapper"]}>
            <li className={styles["notifi__item"]}>
                {/* Quod laboriosam explicabo, Quod laboriosam explicabo */}
            </li>
            <li className={styles["notifi__item"]}>
                {/* This is notification,this is notification, */}
            </li>
        </ul>
    </div>
  )
}

export default memo(Notifications);
