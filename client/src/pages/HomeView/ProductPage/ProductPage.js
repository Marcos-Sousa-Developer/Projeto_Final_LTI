import React, {useState} from 'react';

import product1 from "../../../assets/testproducts/Iphone.png";
import product2 from "../../../assets/testproducts/cannon.png";
import product3 from "../../../assets/testproducts/macbookpro.png";

import { Link } from 'react-router-dom';
import { FiShoppingCart} from 'react-icons/fi';
import { Navbar, Footer } from '../../../components/index';
import './ProductPage.css';

const ProductPage = () => {

  //---------------------------Data from the product--------------------------

  const product = [{
    title: "iPhone 14 Pro Max 64GB",
    src: [
        product1,
        product2,
        product3
    ],
    description: "iPhone 14 Pro Max 64GB 2023, bla bla bla",
    caracteristics: [
      {
        features: [{Marca: 'iPhone', LocaldeProducao:'USA', Validade:'None', Garantia:'3 anos'}],
        sub_features: [{Processador: 'A14', MemoriaRam: '64GB'}]
      }
    ],
    price: "999.9€"
  }]

  //---------------------State to keep track of the first image source--------------------------

  const [firstImageSrc, setFirstImageSrc] = useState(product[0].src[0]);

  //---------------------Array with images from the data of the product--------------------------

  const images = product[0].src.map((src, index) => {
    return (
      <img 
        className='app__pointer'
        key={index} 
        src={src} 
        alt={`product image ${index + 2}`} 
        onClick={() => setFirstImageSrc(src)}
      />
    );
  });

  return (
    <>
        <Navbar></Navbar>
        <div className='app__product_page main__container'>
          <p>Home - Categoria X - SubCategoria X - SubsubCategoria X</p>
          <p className='app__product_page_content_title_mobile'>{product[0].title}</p>
          <div className='app__product_page_content'>
            <div className='app__product_page_content_images'>
              {images}
            </div>
            <div className='app__product_page_content_info'>
              <div className='app__product_page_content_info_main'>
                <div className='app__product_page_content_info_main_img'>
                  <img src={firstImageSrc}></img>
                </div>
                <div className='app__product_page_content_info_main_img_mobile'>{images}</div>
                <div className='app__product_page_content_header'>
                  <p className='app__product_page_content_title'>{product[0].title}</p>
                  <p className='app__product_page_content_price'>{product[0].price}</p>
                  <div className='app__product_page_content_supplier'>

                  </div>
                  <div className='app__product_page_content_description'>
                    {product[0].description}
                  </div>
                  <div className='app__product_page_content_actions'>
                    <div>

                    </div>
                    <button className='main__action_btn'>Adicionar <FiShoppingCart></FiShoppingCart></button>
                  </div>
                </div>
              </div>
              <div className='app__product_page_content_info_characteristics'>
                <p  className='app__product_page_content_characteristics_title'>Informações Técnicas</p>
                <table>
                  <thead>
                    <tr>
                      <th>Marca</th>
                      <th>LocaldeProducao</th>
                      <th>Validade</th>
                      <th>Garantia</th>
                      <th>Processador</th>
                      <th>MemoriaRam</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{product[0].caracteristics[0].features[0].Marca}</td>
                      <td>{product[0].caracteristics[0].features[0].LocaldeProducao}</td>
                      <td>{product[0].caracteristics[0].features[0].Validade}</td>
                      <td>{product[0].caracteristics[0].features[0].Garantia}</td>
                      <td>{product[0].caracteristics[0].sub_features[0].Processador}</td>
                      <td>{product[0].caracteristics[0].sub_features[0].MemoriaRam}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
    </>
  );
}

export default ProductPage