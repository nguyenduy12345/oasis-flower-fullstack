import { memo, useContext } from "react"
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Theme } from '/src/stores'
import styles from './styles.module.scss'
const Footer = () => {
    const { isDark } = useContext(Theme)
    const { t } = useTranslation('footer') 
  return (
    <>
    <footer data-theme={isDark ? 'dark' : 'light'}>
        <div className={`${styles['footer']} row`} >
            <ul className="list list_one col-md-8 col-lg-6">
                <li className="logo fs-6 fw-bold text-uppercase">Floral Oasis</li>
                <li className="name_company fw-bold text-uppercase pb-1">Company floral oasis Viet Nam</li>
                <li className="info fw-light">{t('tax')}: 0106486</li>
                <li className="info fw-light">{t('address')}: {t('add')}</li>
            </ul>
            <ul className="list list_two col-md-4 col-lg-3">
                <li className="list_title fw-bold text-uppercase">Company</li>
                <li className="info"><Link to="/about">{t('company.item-1')}</Link></li>
                <li className="info"><Link to="">{t('company.item-2')}</Link></li>
                <li className="info"><Link to="">{t('company.item-3')}</Link></li>
                <li className="info"><Link to="">{t('company.item-4')}</Link></li>
                <li className="list_title fw-bold text-uppercase mt-3">{t('connect')}
                    <ul className={`${styles["list_icon"]} row justify-content-start`}>
                        <li className="list_item col-3"><Link to=""><i className="fa-brands fa-facebook"></i></Link></li>
                        <li className="list_item col-3"><Link to=""><i className="fa-brands fa-instagram"></i></Link></li>
                        <li className="list_item col-3"><Link to=""><i className="fa-brands fa-twitter"></i></Link></li>
                        <li className="list_item col-3"><Link to=""><i className="fa-brands fa-tiktok"></i></Link></li>
                    </ul>
                </li>
            </ul>
            <ul className="list list_three col-xs-6 col-sm-8 col-md-6 col-lg-3">
                <li className="list_title fw-bold text-uppercase pb-1">{t('infomation')}</li>
                <li className="list_info fw-light">{t('info.info-1')}</li>
                <li className="list_info fw-light">{t('info.info-2')}</li>
            </ul>
        </div>
    </footer> 
    <p className={`${styles["version"]} fw-light fs-7 text-center col-12`} data-theme={isDark ? 'dark' : 'light'}>Copyright © 2024 . All Rights Reserved</p>
    </>
  )
}
export default memo(Footer)
