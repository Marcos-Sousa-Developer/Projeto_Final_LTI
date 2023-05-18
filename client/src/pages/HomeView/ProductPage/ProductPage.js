import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { FiShoppingCart, FiMinus, FiPlus} from 'react-icons/fi';

import product1 from "../../../assets/testproducts/Iphone.png";
import product2 from "../../../assets/testproducts/cannon.png";
import product3 from "../../../assets/testproducts/macbookpro.png";
import product4 from "../../../assets/testproducts/jacket.png";
import product5 from "../../../assets/testproducts/LEDS.png";

import { Navbar, Footer, SnackBar } from '../../../components/index';
import { ProductSwiper } from './ProductSwiper';
import './ProductPage.css';
import LoadingPage from '../../LoadingPage.js'

import getAllFromDB from '../../../hooks/getAllFromDB';
import getFromDB from '../../../hooks/getFromDB';

const SnackbarType = {
  success: "success",
  fail: "fail",
};

const ProductPage = () => {
  const snackbarRef = useRef(null);
  const [cookies, setCookie] = useCookies(['cart']);
  const [path, setPath] = useState(null)
  const [suppliers, setSuppliers] = useState([]) //id dos anuncios com o product_id igual ao id do produto
  const [adData, setAdData] = useState({
    dataComplete: {},
    title: "",
    src: [
      product1,
      product2,
      product3,
      product4,
      product5,
    ],
    description: "",
    caracteristics: [],
    price: "",
  });

  const [didMount, setDidMount] = useState(false)

  async function getAndSetProduct(idAd){

    let ad = await getAllFromDB("/ads", {id: idAd})
    let product = await getAllFromDB("/products/" + ad[0].product_id)
    setPath("Home - " + ad[0].category_name + " - " + ad[0].subcategory_name + " - " + ad[0].subsubcategory_name)
    let car = []
    try {
      car = JSON.parse(ad[0].extraCharacteristic) 
    } catch (error) {
 
    }
    setAdData({
      dataComplete: ad[0],
      title: ad[0].title,
      src: [
        product1,
        product2,
        product3,
        product4,
        product5,
      ],
      description: ad[0].description,

      caracteristics: car,
      price: ad[0].price,
    });
    let ads = await getAllFromDB("/ads", {product_id: ad[0].product_id})
    let idsAds = []
    ads.map( (ad) => {
      idsAds.push(ad.id)
    })
    setSuppliers(idsAds)
  }
  
  const addToCart = () => {
    let id = adData.dataComplete.id
    const prevValue = cookies.cart || {};
    prevValue[id] = [(prevValue[id]?.[0] ?? 0) + 1, adData.price, adData.title, adData.dataComplete];
    setCookie('cart', prevValue, { path: '/' });
  };


  useEffect(()=>{ 
    setDidMount(false) 
    async function run() {
      const urlParams = new URLSearchParams(window.location.search);
      const idAd = urlParams.get("id");
      if(idAd != null){
       await getAndSetProduct(idAd)
      }
      setDidMount(true)
    }
    run()

  }, []);

  return (
    <>
    {
      didMount == false ? (
        <>
          <LoadingPage></LoadingPage>
        </>
      )
      :
      (
      <>
        <Navbar></Navbar>
        <div className='app__product_page main__container'>
          <p className='app__product_page_path'>{path}</p>
          <p className='app__product_page_content_title_mobile'>{adData.title}</p>
          <div className='app__product_page_content'>
            <div className='app__product_page_content_info'>
              <div className='app__product_page_content_info_main'>
                <ProductSwiper src={adData.src}></ProductSwiper>
                <div className='app__product_page_content_header'>
                  <p className='app__product_page_content_title'>{adData.title}</p>
                  <p className='app__product_page_content_price'>{adData.price}</p>
                  <div className='app__product_page_content_supplier'>
                    <p>Vendido por: X</p>
                    <p>Meter alguma info sobre o fornecedor: distância, por exemplo</p>
                    <p>Fornecedores</p> {/* REVER QUANDO NÃO HA MAIS NENHUM FORNECEDOR, ESTÁ A APARECER -1*/}
                    <Link to={`/market-place?${new URLSearchParams({products: suppliers}).toString()}`}>+ {suppliers.length -1 } fornecedores </Link>
                  </div>
                  <div className='app__product_page_content_description'>
                    {adData.description}
                  </div>
                  <div className='app__product_page_content_actions'>
                    <div className='app__product_page_content_actions_1'>
                      <button><FiMinus></FiMinus></button>
                      <input/>
                      <button><FiPlus></FiPlus></button>
                    </div>
                    <button 
                      className='main__action_btn app__product_page_content_actions_2'         
                      onClick={() => {
                        snackbarRef.current.show(); addToCart()
                      }}>Adicionar <FiShoppingCart></FiShoppingCart>
                    </button>

                    <SnackBar
                      ref={snackbarRef}
                      message="Produto adicionado ao carrinho"
                      type={SnackbarType.success}
                    />
                  </div>
                </div>
              </div>
              <div className='app__product_page_content_info_characteristics'>
                <p  className='app__product_page_content_characteristics_title'>Informações Técnicas</p>
                <table>
                  <thead>
                    <tr>
                    {Object.keys(adData.caracteristics).map((key) => {
                      return (
                        <th>{key}</th>
                      );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                    {Object.keys(adData.caracteristics).map((key) => {
                      const value = adData.caracteristics[key];
                      {console.log(value)}
                      return (
                        <td data-label={key}>{value}</td>
                      );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
        </>
      )
    }
    </>
  );
}

export default ProductPage