import { useTranslation } from 'react-i18next'
import { memo, useContext } from 'react'

import { Theme } from '/src/stores'
import styles from './styles.module.scss'

const About = () => {
  const { isDark } = useContext(Theme)
  const { t } = useTranslation('about')
  return (
    <div className={styles["box__about"]} data-theme={isDark ? 'dark' : 'light'}>
      <div className={styles["about"]} >
      <h1 className={styles["about__title"]}>
        {t('title')}
      </h1>
      <p className={styles["about__des"]}>
        {t('des')}
      </p>
      <p className={styles['about__types']}>
        {t('history')}
      </p>
      <p className={styles['about__types']}>
        {t('service')}
      </p>
      <p className={styles['about__types']}>
        {t('invitation')}  
      </p>
      <ul className='row'>
        <li className='col-xs-12 col-sm-12 col-md-7'>
          <img src="/img/aboutpage/img1.jfif" />
          <h3>Stores</h3>
        </li>
        <li className='col-xs-12 col-sm-12 col-md-5'>
          <img src="/img/aboutpage/img2.jfif" />
          <h3>Address</h3>
        </li>
      </ul>
    </div>
    </div>
  )
}

export default memo(About)
