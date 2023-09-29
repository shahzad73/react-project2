import '../App.css';
import React, { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { ethers } from "ethers";


// this is must for   transport: custom(window.ethereum)   
declare var window: any


const EthersObject = () => {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [provider, setProvider] = useState<any | null>(null)
    const [network, setNetwork] = useState('');
    const [contract, setContract] = useState<any | null>(null);


    const getNetwork = async () => {
        if (provider) {
          const network = await provider.getNetwork();
          setNetwork(network.name);
        }
    };    

    const getBlock = async () => {
        const zz = await provider.getBlock(100004) 
        alert(JSON.stringify(zz));
    }

    async function callContract() {

        const abi = [
            // Read-Only Functions
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
        
            // Authenticated Functions
            "function transfer(address to, uint amount) returns (bool)",
        
            // Events
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];
        
        // This can be an address or an ENS name
        const address = "0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb";
        
        const erc20 = new ethers.Contract(address, abi, provider);
        await erc20.connect(provider);

        alert( await erc20.getAddress() );
        alert( await erc20.decimals() );
        alert( await erc20.balanceOf("0x1a8929fbE9abEc00CDfCda8907408848cBeb5300") );
        alert( await erc20.symbol() );

    }

    async function connectToMetamask() {

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider);
            const accounts = await provider.send("eth_requestAccounts", []);
            setSelectedAddress( accounts[0]);
        } catch(e: any) {
            alert("error")
        }

    }

    return(
        <div>
            { selectedAddress && 
                <span>
                    <p>Welcome {selectedAddress}</p>
                    <button onClick={() => getNetwork()}>Get Network</button>       
                    <br /><br />         
                    Connected network - {network}
                    <br /><br />
                    <button onClick={() => callContract()}>Call</button>  
                    <br /><br />
                    <button onClick={() => getBlock()}>Get Blocks</button>  
                    <br />                
                </span>
            }
            
            {!selectedAddress && <span>
                <button onClick={() => connectToMetamask()}>Connect to Metamask</button>
            </span>}
        </div>
    )


}

export default EthersObject;

