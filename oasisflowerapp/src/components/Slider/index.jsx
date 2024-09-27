import { useRef, useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.scss'

const SimpleSlider = ({slides}) => {
  const { i18n } = useTranslation()
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
  };
  return (
    <div className={`${styles["slider"]} slider-container`} >
    <Slider {...settings}>
        {slides.map((slide) => (
        <div className={styles['slider__item']} key={slide.id}>
          <img src={slide.src} />
          <p>{i18n.language == 'en' ? slide.desEN : slide.desVI}</p>
        </div>
        ))}
    </Slider>
    </div>
  );
}
export default memo(SimpleSlider);