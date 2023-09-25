import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'


import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";

import Main from "./pages/main";
import Ethereum from "./pages/ethereum";
import EthersObject from "./pages/ethers";


function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <header className="App-header">

        <div className="page">

            <div className="left-section">
                <Link  to="/" > Main </Link>          
                <br /><br />                                                                            
                <Link to="/ethereum" > Wallet Connect 2 </Link>              
                <br /><br /> 
                <Link to="/ethers" > Ethers </Link>                        
                <br /><br />   
            </div>

            <div className="right-section">
                  <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/ethers" element={<EthersObject />} />                          
                        <Route path="/ethereum" element={<Ethereum />} />  
                  </Routes>
            </div>        


        </div>

        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
