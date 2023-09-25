import '../App.css';
import React, { useEffect } from 'react';
import { useState } from "react";
import { useWeb3Modal } from '@web3modal/react'

import { createPublicClient, createWalletClient, http } from 'viem';
import { custom } from 'viem'
import { mnemonicToAccount } from 'viem/accounts';

import { fetchToken } from '@wagmi/core'
import { Input } from 'semantic-ui-react'

import { wagmiContract } from '../data/erc20ABI'

import { 
  configureChains, 
  createConfig, 
  WagmiConfig,
  useAccount,
  useDisconnect,
  useToken,
  useBalance,
  useConnect,
  useContractRead,
  useSwitchNetwork,
  useNetwork,
  usePrepareContractWrite, 
  useContractWrite,
  useWaitForTransaction,
  useWalletClient
 } from 'wagmi'

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { arbitrum, mainnet, polygon, sepolia } from 'wagmi/chains'



const chains = [arbitrum, mainnet, polygon, sepolia]
const projectId = '0e2728e228f73097bf77370da15690e2'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

// this is must for   transport: custom(window.ethereum)   
declare var window: any


const Ethereum = () => {

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
          <HomePage />
          <br /><br /><br />
          <BalanceWig />
          <br /><br /><br />
          <ConnectedConnection />
          <br /><br /><br />
          <ContractReadWig />
          <br /><br /><br />
          <ContractReadWigGetKYCData />          
          <br /><br /><br />
          <ChangeNetwork />
          <br /><br /><br /><br />
          <SendATransactionMOdifyKYC />
          <br /><br />
          <SendATransactionMOdifyKYC2 />
          <br /><br /><br /><br />          
          <SendATransactionTransferTokens />
          <br /><br /><br />
          <ViemContract />
          <br /><br /><br />
          <ViewContractDeploy />          
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeVariables= {{
          '--w3m-font-family': 'Roboto, sans-serif',
          '--w3m-accent-color': '#F5841F',
          '--w3m-accent-fill-color': '#FFFFFF',
          '--w3m-background-color': '#C0C0C0',
          '--w3m-overlay-backdrop-filter': '#C0C0C0'
        }}
      />
    </>
  );

  function HomePage() {

    const { connector: activeConnector, isConnected, address, isConnecting, isDisconnected } = useAccount()
    const { disconnect } = useDisconnect()

    const { data, isError, isLoading } = useToken({
      address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
      // chainId: 1    specify chainid   otherwise default from wallet connect will be used
    })


    const { open } = useWeb3Modal()

    return (
      <span>
        { isConnected ? (
          <span>
          <br />
          Connected to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {address}
          <br /><br />
          <button onClick={() => disconnect()}>Disconnect</button>
          </span>
         ) : (
            <button onClick={() => open()}>Connect</button>
        ) }
        <br /><br /><br />
        <b>Token Details</b> 
        {!isDisconnected && (
            <span>
              <br />Wallet connected checked with isDisconected
            </span>
        )}        
        {isConnecting && (
            <span>
              <br />isConnecting is true
            </span>
        )}        
        {!isConnected && (
            <span>
              <br />Connecitng Wallet .......
            </span>
        )}
        {isConnected && (
            <span>
              <br />Symbol : {data?.symbol} 
              <br />Total Supply : {data?.totalSupply.formatted}
              <br />Decimals : {data?.decimals}
              <br />Name : {data?.name}
              <br />Active Connection : {activeConnector?.name}
            </span>
        )}

      </span>
    )

  }

  function BalanceWig() {

      const [address1, setAddress1] = useState("");

      const useBalanceObject = useBalance({
        address: `0x${address1}`,
      });

      const handleChange = (event: any) => {
          setAddress1( event.target.value )
      }

      return (
        <div>
            <Input onChange={handleChange} size="small" style={{'width': '600px'}} placeholder="Find..." width="500px"/>
            <br />
            {useBalanceObject.isLoading && <div>Fetching balance…</div>}
            {useBalanceObject.isError && <div>Error fetching balance</div>}
            {!useBalanceObject.isError && <span>
                Balance: {useBalanceObject.data?.formatted} - {useBalanceObject.data?.symbol}
              </span>
            }
        </div>
      )
  }

  function ConnectedConnection() {

    const { connector: activeConnector, isConnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
   
    return (
      <>
        {isConnected && <div>Connected</div>}

      </>
    )


  }

  function ContractReadWig() {

    const { data: accessTokenBalance, isError, isLoading, status, isRefetching } = useContractRead({
        address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
        abi: [{
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }],
        functionName: 'balanceOf',
        args: ["0x1a8929fbE9abEc00CDfCda8907408848cBeb5300"],
        onError(error) {
          //alert('Error' + error)
        },
        onSettled(data, error) {
           //alert(data);   // you can also get data this way if you do not want to use data: accessTokenBalance
        }
    })

    return (
      <span>
          {isLoading && <span>Loading .... </span>}
          {isError && <span>Some error </span>}
          {!isError && <span> This is data - {accessTokenBalance?.toString()} </span>}
          <br /> Current Status - {status}        
          <br /> {status == "success" ? (<span>it is success</span>) : (<span>no success</span>) }
          <br /> {status == "error" ? (<span>it is a error</span>) : (<span>no error</span>) }
          <br /> {isRefetching && <span>Refreshing ....</span>}
      </span>
    )

  }

  function ContractReadWigGetKYCData() {
    //const useContractReadObject = useContractRead({

    const [kycData, setKycData] = useState([]);

    const { isError, isLoading, status } = useContractRead({      
        address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
        abi: [    {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getKYCData",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }],
        functionName: 'getKYCData',
        args: ["0x1a8929fbE9abEc00CDfCda8907408848cBeb5300"],
        onError(error) {
            //alert('Error' + error)
        },
        onSettled(data: any, error){
          //alert(data[0]);
          //setKycData(data);
        }
    })

    return (
      <span>
          {isLoading && <span>Loading .... </span>}
          {isError && <span>Some error. </span>}
          The status of 1 is  - {status}

      </span>
    )

  }  

  function ChangeNetwork() {

    const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
      useSwitchNetwork()
   
    return (
      <>
        {chain && <div>Connected to {chain.name}</div>}
   
        {chains.map((x) => (
          <button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            {x.name}
            {isLoading && pendingChainId === x.id && ' (switching)'}
          </button>
        ))}
   
        <div>{error && error.message}</div>
      </>
    )

  }

  function SendATransactionMOdifyKYC() {

      const { config, error } = usePrepareContractWrite({
        address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
        abi: [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "receiveRestriction",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "sendRestriction",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "modifyKYCData",
            "outputs": []
          }
        ],
        args: ["0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d", BigInt(1294330994), BigInt(1294330994)],
        functionName: 'modifyKYCData'
      })
      const { write } = useContractWrite(config) 

      return (
        <>
          <button disabled={!write} onClick={() => write?.()}>
            Setup modifyKYCData
          </button>
          {error && (
            <div>An error occurred preparing the transaction: {error.message}</div>
          )}
        </>
      ) 
    
  }


  function SendATransactionMOdifyKYC2() {

    //const { connector: activeConnector, isConnected } = useAccount()
    //const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

    const useAccountObject = useAccount();
    const useConnectObject = useConnect();

    const { open } = useWeb3Modal()
        

    const useContractWtireObject = useContractWrite({      
      address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "receiveRestriction",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sendRestriction",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "modifyKYCData",
          "outputs": []
        }
      ],
      functionName: 'modifyKYCData',
    })


    /*const { config, error } = usePrepareContractWrite({
      address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "receiveRestriction",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sendRestriction",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "modifyKYCData",
          "outputs": []
        }
      ],
      //args: ["0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d", BigInt(1294330994), BigInt(1294330994)],
      functionName: 'modifyKYCData'
    })
    const { write } = useContractWrite(config) */
      

    const sendTrnasactionToBlockchain = () => {
      useContractWtireObject.write({
        args: ["0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d", BigInt(1294330994), BigInt(1294330994)],
        //from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        //value: parseEther('0.01'),
      })
    }

    const connectWalletObject = () => {
        useConnectObject.connect();
    }


    return (
      <>      
        Send Modify KYC info transaction wiht dynamic arguments in write
        <br />
        {useAccountObject.isConnecting && <span> Please wait Account is connecting  </span>}
        {useAccountObject.isConnected ? <span>
              Your Current Account is  { useAccountObject.address } <br />
              <button onClick={sendTrnasactionToBlockchain}> Setup modifyKYCData Info With argument </button>
              {useContractWtireObject.error && (
                <div>An error occurred preparing the transaction: {useContractWtireObject.error.message}</div>
              )}
              <br /> Current Status - {useContractWtireObject.status}        
              <br /> {useContractWtireObject.status == "idle" ? (<span>it is in idel state</span>) : (<span>Running Transaction</span>) }
              <br /> {useContractWtireObject.status == "success" ? (<span>it is success</span>) : (<span>no success</span>) }
              <br /> {useContractWtireObject.status == "error" ? (<span>it is a error</span>) : (<span>no error</span>) }
              {useContractWtireObject.isLoading && <div>Check Wallet inside is Loading</div>}
              {useContractWtireObject.isSuccess && <div>Transaction: {JSON.stringify(useContractWtireObject.data)}</div>}
          </span>: <span>
              Wallet is not yet connected. Please connect with wallet <br />
              <button onClick={() => open()}>Connect</button>
          </span>
        }
      </>
    ) 
  
}

  function SendATransactionTransferTokens() {

    const { config, error } = usePrepareContractWrite({
      address: '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb',
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "transfer",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ]
        }
      ],
      args: ["0xAD3DF0f1c421002B8Eff81288146AF9bC692d13d", BigInt(10000000000000000000) ],
      functionName: 'transfer',
      onSuccess(data) {
        //alert('Success.....')
        //alert(JSON.stringify(data));
      },      
      onError(error) {
        //alert('error')
        //alert(error);
      },      
    })
    
    // const { data, isLoading, isSuccess, write, status } = useContractWrite(config) 
    // This an also be written as 
    const contractWtite = useContractWrite(config) 

    useWaitForTransaction({
      hash: contractWtite.data?.hash,
      onSuccess(data) {
         //alert('when transaction wait come back Success');
         //alert("blockhash-" + data?.blockHash + " gas used-" + data?.gasUsed + " status-" + data?.status );
      },  
    })


    return (
      <>
          <button disabled={!contractWtite.write} onClick={() => contractWtite.write?.()}>  Transfer  </button>

          { error && (
            <div>An error occurred preparing the transaction: {error.message}</div>
          )}

          {contractWtite.isLoading && <div>Loading Wallet ....</div>}
          {contractWtite.isSuccess && <div>Transaction: {contractWtite.data?.hash}</div>}   
          <br />
          Status is {contractWtite.status}     
      </>
    )
  
  }


  // Viem .............................

  function ViemContract() {

    const [address, setAddress] = useState("");
    const [addressBalanceOf, setAddressBalanceOf] = useState("");    
    const [supplyTotal, setSupplyTotal] = useState("");

    useEffect(() => {

      const account = mnemonicToAccount('legal winner thank year wave sausage worth useful legal winner thank yellow'); 
      const client2 = createWalletClient({
        account,
        chain: mainnet,
        transport: http()
      });
      setAddress ( client2.account.address )


      const client = createPublicClient({
        chain: sepolia,
        transport: http(),
      })

      const address = '0x6b1792a04fcf47e9a2e8ee6c8d455e9e6ce8c5bb'
      
      const fetchTotalSupply = async () => {

          /*const [name, totalSupply, symbol, balance] = await Promise.all([
            client.readContract({
              ...wagmiContract,
              address: address,
              functionName: 'name',
            }),
            client.readContract({
              ...wagmiContract,
              address: address,              
              functionName: 'totalSupply',
            }),
            client.readContract({
              ...wagmiContract,
              address: address,              
              functionName: 'symbol',
            }),
            client.readContract({
              ...wagmiContract,
              functionName: 'balanceOf',
              address: address,              
              args: [address],
            }),
          ])

          setAddressBalanceOf(balance.toString())
          setSupplyTotal(totalSupply.toString());*/
      }
      fetchTotalSupply()
      .catch(console.error) 


    }, []);

    return (
      <div>
          <span> Address :  {address} </span>
          <br />
          <span> Total Supply : {supplyTotal} </span>
          <br />
          <span> Balance of : {addressBalanceOf} </span>
          <br />
      </div>
    )
  }

  function ViewContractDeploy() {
    const [hash, setHash] = useState<undefined | `0x${string}`>();

    const walletClient: any = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum)   // declare    declare var window: any     on top
    })

    async function callContract() {
      const [account] = await walletClient.getAddresses()
      //alert(account);
    }

    async function deployContract() {
      const [account] = await walletClient.getAddresses()

      try {

          const hashTemp = await walletClient.deployContract({
            abi: [
              {
                "inputs": [
                  {
                    "internalType": "uint256",
                    "name": "_initialSupply",
                    "type": "uint256"
                  },
                  {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  }
                ],
                "name": "Approval",
                "type": "event"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                  }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
              },
              {
                "anonymous": false,
                "inputs": [
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                  },
                  {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                  }
                ],
                "name": "Transfer",
                "type": "event"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                  }
                ],
                "name": "allowance",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "name": "approve",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                  }
                ],
                "name": "balanceOf",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                  {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                  }
                ],
                "name": "decreaseAllowance",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                  }
                ],
                "name": "increaseAllowance",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "name",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "owner",
                "outputs": [
                  {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "renounceOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                  {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                  {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                  }
                ],
                "stateMutability": "view",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "name": "transfer",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                  },
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "name": "transferFrom",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                  }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "name": "mint",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              },
              {
                "inputs": [
                  {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  }
                ],
                "name": "burn",
                "outputs": [
                  {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                  }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
              }
            ],
            account: account,
            bytecode: '0x60806040523480156200001157600080fd5b50604051620021e8380380620021e8833981810160405281019062000037919062000426565b8081816003908051906020019062000051929190620002ed565b5080600490805190602001906200006a929190620002ed565b5050506200008d62000081620000a760201b60201c565b620000af60201b60201c565b6200009f33836200017560201b60201c565b505062000704565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415620001e8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001df90620004d3565b60405180910390fd5b620001fc60008383620002e360201b60201c565b80600260008282546200021091906200058a565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002c39190620004f5565b60405180910390a3620002df60008383620002e860201b60201c565b5050565b505050565b505050565b828054620002fb9062000627565b90600052602060002090601f0160209004810192826200031f57600085556200036b565b82601f106200033a57805160ff19168380011785556200036b565b828001600101855582156200036b579182015b828111156200036a5782518255916020019190600101906200034d565b5b5090506200037a91906200037e565b5090565b5b80821115620003995760008160009055506001016200037f565b5090565b6000620003b4620003ae8462000546565b62000512565b905082815260208101848484011115620003cd57600080fd5b620003da848285620005f1565b509392505050565b600082601f830112620003f457600080fd5b8151620004068482602086016200039d565b91505092915050565b6000815190506200042081620006ea565b92915050565b600080604083850312156200043a57600080fd5b60006200044a858286016200040f565b925050602083015167ffffffffffffffff8111156200046857600080fd5b6200047685828601620003e2565b9150509250929050565b60006200048f601f8362000579565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b620004cd81620005e7565b82525050565b60006020820190508181036000830152620004ee8162000480565b9050919050565b60006020820190506200050c6000830184620004c2565b92915050565b6000604051905081810181811067ffffffffffffffff821117156200053c576200053b620006bb565b5b8060405250919050565b600067ffffffffffffffff821115620005645762000563620006bb565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b60006200059782620005e7565b9150620005a483620005e7565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620005dc57620005db6200065d565b5b828201905092915050565b6000819050919050565b60005b8381101562000611578082015181840152602081019050620005f4565b8381111562000621576000848401525b50505050565b600060028204905060018216806200064057607f821691505b602082108114156200065757620006566200068c565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006f581620005e7565b81146200070157600080fd5b50565b611ad480620007146000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063715018a611610097578063a457c2d711610066578063a457c2d7146102c5578063a9059cbb146102f5578063dd62ed3e14610325578063f2fde38b1461035557610100565b8063715018a61461024f5780638da5cb5b1461025957806395d89b41146102775780639dc29fac1461029557610100565b8063313ce567116100d3578063313ce567146101a157806339509351146101bf57806340c10f19146101ef57806370a082311461021f57610100565b806306fdde0314610105578063095ea7b31461012357806318160ddd1461015357806323b872dd14610171575b600080fd5b61010d610371565b60405161011a91906116fd565b60405180910390f35b61013d600480360381019061013891906111c0565b610403565b60405161014a91906116e2565b60405180910390f35b61015b610426565b604051610168919061189f565b60405180910390f35b61018b60048036038101906101869190611171565b610430565b60405161019891906116e2565b60405180910390f35b6101a961045f565b6040516101b691906118ba565b60405180910390f35b6101d960048036038101906101d491906111c0565b610468565b6040516101e691906116e2565b60405180910390f35b610209600480360381019061020491906111c0565b61049f565b60405161021691906116e2565b60405180910390f35b6102396004803603810190610234919061110c565b6104bd565b604051610246919061189f565b60405180910390f35b610257610505565b005b610261610519565b60405161026e91906116c7565b60405180910390f35b61027f610543565b60405161028c91906116fd565b60405180910390f35b6102af60048036038101906102aa91906111c0565b6105d5565b6040516102bc91906116e2565b60405180910390f35b6102df60048036038101906102da91906111c0565b6105f3565b6040516102ec91906116e2565b60405180910390f35b61030f600480360381019061030a91906111c0565b61066a565b60405161031c91906116e2565b60405180910390f35b61033f600480360381019061033a9190611135565b61068d565b60405161034c919061189f565b60405180910390f35b61036f600480360381019061036a919061110c565b610714565b005b606060038054610380906119cf565b80601f01602080910402602001604051908101604052809291908181526020018280546103ac906119cf565b80156103f95780601f106103ce576101008083540402835291602001916103f9565b820191906000526020600020905b8154815290600101906020018083116103dc57829003601f168201915b5050505050905090565b60008061040e610798565b905061041b8185856107a0565b600191505092915050565b6000600254905090565b60008061043b610798565b905061044885828561096b565b6104538585856109f7565b60019150509392505050565b60006012905090565b600080610473610798565b9050610494818585610485858961068d565b61048f91906118f1565b6107a0565b600191505092915050565b60006104a9610c6f565b6104b38383610ced565b6001905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b61050d610c6f565b6105176000610e44565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606060048054610552906119cf565b80601f016020809104026020016040519081016040528092919081815260200182805461057e906119cf565b80156105cb5780601f106105a0576101008083540402835291602001916105cb565b820191906000526020600020905b8154815290600101906020018083116105ae57829003601f168201915b5050505050905090565b60006105df610c6f565b6105e98383610f0a565b6001905092915050565b6000806105fe610798565b9050600061060c828661068d565b905083811015610651576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106489061185f565b60405180910390fd5b61065e82868684036107a0565b60019250505092915050565b600080610675610798565b90506106828185856109f7565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b61071c610c6f565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141561078c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107839061175f565b60405180910390fd5b61079581610e44565b50565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610810576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108079061183f565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610880576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108779061177f565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161095e919061189f565b60405180910390a3505050565b6000610977848461068d565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146109f157818110156109e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109da9061179f565b60405180910390fd5b6109f084848484036107a0565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610a67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5e9061181f565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ad7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ace9061171f565b60405180910390fd5b610ae28383836110d8565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610b68576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5f906117bf565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610c56919061189f565b60405180910390a3610c698484846110dd565b50505050565b610c77610798565b73ffffffffffffffffffffffffffffffffffffffff16610c95610519565b73ffffffffffffffffffffffffffffffffffffffff1614610ceb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ce2906117df565b60405180910390fd5b565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610d5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d549061187f565b60405180910390fd5b610d69600083836110d8565b8060026000828254610d7b91906118f1565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e2c919061189f565b60405180910390a3610e40600083836110dd565b5050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610f7a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f71906117ff565b60405180910390fd5b610f86826000836110d8565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561100c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110039061173f565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600260008282540392505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516110bf919061189f565b60405180910390a36110d3836000846110dd565b505050565b505050565b505050565b6000813590506110f181611a70565b92915050565b60008135905061110681611a87565b92915050565b60006020828403121561111e57600080fd5b600061112c848285016110e2565b91505092915050565b6000806040838503121561114857600080fd5b6000611156858286016110e2565b9250506020611167858286016110e2565b9150509250929050565b60008060006060848603121561118657600080fd5b6000611194868287016110e2565b93505060206111a5868287016110e2565b92505060406111b6868287016110f7565b9150509250925092565b600080604083850312156111d357600080fd5b60006111e1858286016110e2565b92505060206111f2858286016110f7565b9150509250929050565b61120581611947565b82525050565b61121481611959565b82525050565b6000611225826118d5565b61122f81856118e0565b935061123f81856020860161199c565b61124881611a5f565b840191505092915050565b60006112606023836118e0565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006112c66022836118e0565b91507f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008301527f63650000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061132c6026836118e0565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006113926022836118e0565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006113f8601d836118e0565b91507f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006000830152602082019050919050565b60006114386026836118e0565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061149e6020836118e0565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b60006114de6021836118e0565b91507f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008301527f73000000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006115446025836118e0565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006115aa6024836118e0565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b60006116106025836118e0565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000611676601f836118e0565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b6116b281611985565b82525050565b6116c18161198f565b82525050565b60006020820190506116dc60008301846111fc565b92915050565b60006020820190506116f7600083018461120b565b92915050565b60006020820190508181036000830152611717818461121a565b905092915050565b6000602082019050818103600083015261173881611253565b9050919050565b60006020820190508181036000830152611758816112b9565b9050919050565b600060208201905081810360008301526117788161131f565b9050919050565b6000602082019050818103600083015261179881611385565b9050919050565b600060208201905081810360008301526117b8816113eb565b9050919050565b600060208201905081810360008301526117d88161142b565b9050919050565b600060208201905081810360008301526117f881611491565b9050919050565b60006020820190508181036000830152611818816114d1565b9050919050565b6000602082019050818103600083015261183881611537565b9050919050565b600060208201905081810360008301526118588161159d565b9050919050565b6000602082019050818103600083015261187881611603565b9050919050565b6000602082019050818103600083015261189881611669565b9050919050565b60006020820190506118b460008301846116a9565b92915050565b60006020820190506118cf60008301846116b8565b92915050565b600081519050919050565b600082825260208201905092915050565b60006118fc82611985565b915061190783611985565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561193c5761193b611a01565b5b828201905092915050565b600061195282611965565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156119ba57808201518184015260208101905061199f565b838111156119c9576000848401525b50505050565b600060028204905060018216806119e757607f821691505b602082108114156119fb576119fa611a30565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b611a7981611947565b8114611a8457600080fd5b50565b611a9081611985565b8114611a9b57600080fd5b5056fea2646970667358221220cb769acdc9b5005462b50f55da7fc6bae36dd6892fe9b2aebf0c44278cdec41f64736f6c63430008000033',
            args: [BigInt(100000), 'TST1']
          })

          setHash(hashTemp);          

      } catch(e: any) {
          alert(e.toString())
      }

    }

    const useWaitForTransactionObj = useWaitForTransaction({
      hash: hash,
    })


    return (
      <span>          
          <button  onClick={() => callContract()}> Call </button>
          <button  onClick={() => deployContract()}> Deploy </button>
          <br />

          {useWaitForTransactionObj.isIdle && <span>Idle State - Waiting to send transaction</span>}

          {useWaitForTransactionObj.isLoading && 
            <span>
                isLoading is executing with transaction id - {hash}
            </span>
          }

          {useWaitForTransactionObj.isFetching && 
            <span>
              Now Fetching contract execution with transaction id - {hash}
            </span>
          }

          {useWaitForTransactionObj.isSuccess && 
            <span>
              Contract is executed with transaction id - {hash}
            </span>
          }          

      </span>
    )    
  }






  
}

export default Ethereum;


