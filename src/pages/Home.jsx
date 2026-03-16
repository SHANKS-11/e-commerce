import Slider from 'react-slick'
import { Helmet } from 'react-helmet-async'
import slider1 from '../assets/slider-image-1.jpeg'
import slider2 from '../assets/slider-image-2.jpeg'
import slider3 from '../assets/slider-image-3.jpeg'
import side1 from '../assets/grocery-banner.png'
import side2 from '../assets/grocery-banner-2.jpeg'

import ProductsGrid from './Products.jsx'

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="row g-0 mb-4">
        <div className="col-md-9">
          <Slider {...settings}>
            <img src={slider1} className="w-100" style={{ height: 420, objectFit: 'cover' }} />
            <img src={slider2} className="w-100" style={{ height: 420, objectFit: 'cover' }} />
            <img src={slider3} className="w-100" style={{ height: 420, objectFit: 'cover' }} />
          </Slider>
        </div>
        <div className="col-md-3 d-none d-md-flex flex-column">
          <img src={side1} className="w-100" style={{ height: 210, objectFit: 'cover' }} />
          <img src={side2} className="w-100" style={{ height: 210, objectFit: 'cover' }} />
        </div>
      </div>

      <ProductsGrid embedded />
    </>
  )
}
