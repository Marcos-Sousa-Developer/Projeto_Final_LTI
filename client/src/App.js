import { Routes, Route, BrowserRouter  } from "react-router-dom"; 

import Dashboard from "./pages/Admin/Dashboard";
import Gerir_consumidores from "./pages/Admin/Gerir_consumidores";
import Gerir_fornecedores from "./pages/Admin/Gerir_fornecedores";

import {Home, Login, Cart, Profile} from './pages/HomeView/index';
import './index.css';

function App() {   

  return (
    <BrowserRouter forceRefresh={true}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="admin">
            <Route index element={<Dashboard />} />
            <Route exact path="gerir_consumidores" element={<Gerir_consumidores />} />
            <Route exact path="gerir_fornecedores" element={<Gerir_fornecedores />} />
          </Route> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;
