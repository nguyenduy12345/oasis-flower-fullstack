import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { memo, useContext } from "react"
import { Theme } from '/src/stores'
 
import { SimpleSlider } from '/src/components'
import styles from './styles.module.scss'
import { slides } from '/src/assets/data'

const Home = () => {
    const { isDark } = useContext(Theme)
    const { t } = useTranslation('home');
  return (
    <>
    <div className={styles["home"]} data-theme={isDark ? 'dark' : 'light'}>
        <SimpleSlider slides={slides} />
    <div className={styles["delivery"]}>
        <img loading="lazy" src="/img/BRAND_USPS_1.jpg" />
    </div>
    <div className={styles["menu"]}>
        <div className={`${styles["menu__list"]} row m-0 justify-content-between`}>
            <div className={`${styles["menu__item"]} col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to="/products/flowers"><img loading="lazy" src="/img/menu_products/flower.jpg" /></Link>
                <div className={styles["menu__name"]}><Link to="/products/flowers">{t('list-page-product.page-flowers')}</Link></div>
            </div>
            <div className={`${styles["menu__item"]} col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to="/products/cakes"><img loading="lazy" src="/img/menu_products/horizontal-pulling-slice-from-cake.jpg" /></Link>
              
                <div className={styles["menu__name"]}><Link to="/products/cakes">{t('list-page-product.page-cakes')}</Link></div>
            </div>
            <div className={`${styles["menu__item"]} col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to="/products/accessories"><img loading="lazy" src="/img/menu_products/gift.jpg" /></Link>             
                <div className={styles["menu__name"]}><Link to="/products/accessories">{t('list-page-product.page-accessories')}</Link></div>
            </div>
        </div>
    </div>
    <div className={styles["brands"]}>
        <img loading="lazy" src="/img/PRESS_LOGOS_US_1.jpg" />
    </div>
    <div className={styles["events"]}>
        <h3>{t('events.title')}</h3>
        <p className={styles["events__description"]}>{t('events.des')}</p>
        <div className={`${styles["events__list"]} row justify-content-between`}>
            <div className={`${styles["events__item"]} card col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to="/occasions"><img loading="lazy" src="/img/events/WEDDING.jpg" /></Link>
                <div className="card-body">
                    <p className={`${styles["events__title"]} card-title`}>{t('events.item-1.title')}</p>
                    <p className={`${styles["events__info"]} card-text`}>{t('events.item-1.des')}</p>
                    <Link to="/occasions" className={`${styles["events__link"]} card-link`}>{t('events.item-1.link')}</Link>
                </div>
            </div>
            <div className={`${styles["events__item"]} card col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to=""><img loading="lazy" src="/img/events/TF_DINNER.jpg" /></Link>
                <div className="card-body">
                    <p className={`${styles["events__title"]} card-title`}>{t('events.item-2.title')}</p>
                    <p className={`${styles["events__info"]} card-text`}>{t('events.item-2.des')}</p>
                    <Link to="/occasions" className={`${styles["events__link"]} card-link`}>{t('events.item-2.link')}</Link>
                </div>
            </div>
            <div className={`${styles["events__item"]} card col-xs-12 col-sm-12 col-md-6 col-lg-4`}>
                <Link to=""><img loading="lazy" src="/img/events/Corinthia.jpg" /></Link>
                <div className="card-body">
                    <p className={`${styles["events__title"]} card-title`}>{t('events.item-3.title')}</p>
                    <p className={`${styles["events__info"]} card-text`}>{t('events.item-3.des')}</p>
                    <Link to="/occasions" className={`${styles["events__link"]} card-link`}>{t('events.item-3.link')}</Link>
                </div>
            </div>
        </div>
        <div className={styles["btn_see_more"]}><Link to="/occasions">{t('events.button')}</Link></div>
    </div>
    <div className={styles["about__image"]}>
        <img loading="lazy" src="/img/about/TESTIMONIAL_DESKTOP_4.jpg" />
    </div>
    <div className={styles["about"]}>
        <h3>{t('about.title')}</h3>
        <p className={styles["about__description"]}>{t('about.des')}</p>
        <div className={`${styles["about__list"]} row justify-content-between`}>
            <div className={`${styles["about__item"]} card col-xs-12 col-sm-12 col-md-6`}>
                <img loading="lazy" src="/img/about/ab1.jpeg" />
                <div className="card-body">
                    <div className="card-title fw-bold">{t('about.item-1.title')}</div>
                    <div className="card-text">{t('about.item-1.des')}</div>
                    <div className="card-link text-center"><Link to="/products/flowers">{t('about.item-1.link')}</Link></div>
                </div>
            </div>
            <div className={`${styles["about__item"]} card col-xs-12 col-sm-12 col-md-6`}>
                <img loading="lazy" src="/img/about/ab2.jpeg" />
                <div className="card-body">
                    <div className="card-title fw-bold">{t('about.item-2.title')}</div>
                    <div className="card-text">{t('about.item-2.des')}</div>
                    <div className="card-link text-center"><Link to="/about">{t('about.item-2.link')}</Link></div>
                </div>
            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default memo(Home)
