import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser} from 'react-icons/fi';

import images from '../../assets/images.js';
import './styles/Navbar.css';

const NavbarSupplier = () => {
  return (
    <>
        <div className='app__navbarSupplier main__container'>
            <Link to='/'><img src={images.logo} alt="" className=""/></Link>

            <div className='app__navbar_profile'>

                <Link to="/signin" className="flex app__pointer app__navbar_links">
                    <FiUser fontSize={30} color="black" className='profile_icon'></FiUser>

                    <div className="app__navbar_profile_account" style={{margin: '0 .75rem'}}>
                        <span className="profile_link">Conta</span>
                        <p style={{fontSize: '12px', opacity: '80%'}}>Iniciar sessão</p>
                    </div>
                </Link>

                <Link to="/supplier/anunciar" className="flex app__pointer app__navbar_links app__navbarSupplier_btn"  style={{marginRight:'0'}}>
                    Anunciar
                </Link>

            </div>
        </div>
    </>
  )
}

export default NavbarSupplier