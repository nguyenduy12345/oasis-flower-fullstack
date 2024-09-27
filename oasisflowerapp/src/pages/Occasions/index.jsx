import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { memo, useContext } from 'react'

import { Theme } from '/src/stores'
import styles from './styles.module.scss'
import { events } from '/src/assets/data'

const Occasions = () => {
  const { isDark } = useContext(Theme)
  const {t, i18n} = useTranslation('event')
  return (
   <>
    <div className={styles["banner"]}>
        <img src="/src/assets/images/img/occasions/occasions.jpg" alt="" />
    </div>
    <div className={styles['container']} data-theme={isDark ? 'dark' : 'light'}>
    <div className={styles["occasions"]} >
        <p className={styles["occasions__des"]}>{t('des')}</p>   
        <ul className={`${styles['occasions__list']} row`} >
          {events.map((e, index)=> (
            <li key={index} className={`${styles["occasions__item"]} col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
            <img loading='lazy' src={e.src} alt="this is picture" />
            <h4 className={styles["occasions__name"]}>{i18n.language == 'en' ? e.nameEN : e.nameVI}</h4>
            <p className={styles["occasions__info"]}>{i18n.language == 'en' ? e.desEN : e.desVI}</p>
            <Link to="/flowers"><button>SHOP NOW</button></Link>
          </li>
          ))}
        </ul>
        <div className={`${styles["service"]} row`}>
            <img loading='lazy' className="col-md-6" src="/img/occasions/tiffany_b2b_block.jpg" alt="" />
            <div className={`${styles["service__des"]} col-md-6`}>
                <h1>{t('service.title')}</h1>
                <p>{t('service.des')}</p>
                <button>{t('service.button')}</button>
            </div>
        </div>
    </div>
    </div>
   </>
  )
}

export default memo(Occasions)
