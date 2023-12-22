import '../App.css';
import React, { useEffect } from 'react';
import { useState } from "react";
import { useWeb3Modal } from '@web3modal/react'

import { createPublicClient, createWalletClient, http } from 'viem';
import { custom } from 'viem'
import { mnemonicToAccount } from 'viem/accounts';

import { fetchToken } from '@wagmi/core'
import { Button, Input } from 'semantic-ui-react'

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
import { arbitrum, avalanche, avalancheFuji, mainnet, polygon, sepolia } from 'wagmi/chains'

import { ERC1404Contract } from '../data/erc1404';
import { SwapperContract } from '../data/swapper';
import { ERC20 } from '../data/erc20'

const chains = [arbitrum, mainnet, polygon, sepolia, avalancheFuji]
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
          Thinks to do before any deployment     change chains variable on top and include the chain and then in the specific deployment function also change createWalletClient and include the chain id
          <br /><br /><br />          
          <ViewDeployERC1404 />   
          <br /><br />
          <VimeDeploySwapContract />       
          <br /><br />
          <ViemDeployERC20 />        
          <br /><br />
          <CallSwapCloseFunction /> 
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
            ---------------------------------------------------------
            <h4>Get SEP balance of address from Sepolia</h4>
            Enter without 0x <br />
            <Input onChange={handleChange} size="small" style={{'width': '600px'}} placeholder="Find..." width="500px"/>
            <br />
            {useBalanceObject.isLoading && <div>Fetching balance…</div>}
            {useBalanceObject.isError && <div>Error fetching balance</div>}
            {!useBalanceObject.isError && <span>
                Balance: {useBalanceObject.data?.formatted} - {useBalanceObject.data?.symbol}
              </span>
            }
            <br />---------------------------------------------------------            
        </div>
      )
  }

  function ConnectedConnection() {

    const { connector: activeConnector, isConnected } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
   
    return (
      <>
        ---------------------------------------------------------<br />
        {isConnected && <div>Connected</div>}
        <br />---------------------------------------------------------        
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
          ---------------------------------------------------------
          <h4>balanceOf of a address of Smart contract</h4>
          {isLoading && <span>Loading .... </span>}
          {isError && <span>Some error </span>}
          {!isError && <span> This is data - {accessTokenBalance?.toString()} </span>}
          <br /> Current Status - {status}        
          <br /> {status == "success" ? (<span>it is success</span>) : (<span>no success</span>) }
          <br /> {status == "error" ? (<span>it is a error</span>) : (<span>no error</span>) }
          <br /> {isRefetching && <span>Refreshing ....</span>}
          <br />---------------------------------------------------------
      </span>
    )

  }

  function ContractReadWigGetKYCData() {
    //const useContractReadObject = useContractRead({

    const [kycData1, setKycData1] = useState(0);
    const [kycData2, setKycData2] = useState(0);    

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
        onSettled(data: any, error) {
            setKycData1(data[0].toString());
            setKycData2(data[1].toString());
        }
    })

    return (
      <span>
          ----------------------------------------------------------
          <h4>Call getKYCData</h4>
          Data received is Sell Restriction {kycData1}   &nbsp;&nbsp;&nbsp;&nbsp;    Buy Restriction {kycData2}
          {isLoading && <span>Loading .... </span>}
          {isError && <span>Some error. </span>}
          <br /> The status of is  - {status}
          <br />----------------------------------------------------------
      </span>
    )

  }  

  function ChangeNetwork() {

    const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
      useSwitchNetwork()
   
    return (
      <>
        ---------------------------------------------------------- <br />
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

        ----------------------------------------------------------
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
          ----------------------------------------------------------------
          <h4>ModifyKYCData transaction</h4>
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
        <br />-------------------------------------------------------------
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
          ----------------------------------------------------------------------------
          <h4>Transfer Transaction</h4>
          <button disabled={!contractWtite.write} onClick={() => contractWtite.write?.()}>  Transfer  </button>

          { error && (
            <div>An error occurred preparing the transaction: {error.message}</div>
          )}

          {contractWtite.isLoading && <div>Loading Wallet ....</div>}
          {contractWtite.isSuccess && <div>Transaction: {contractWtite.data?.hash}</div>}   
          <br />
          Status is {contractWtite.status}     
          <br />---------------------------------------------------------------------------
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
        chain: mainnet,
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
          -----------------------------------------------------------------
          <h4>Viem - get token info</h4>
          <span> Address :  {address} </span>
          <br />
          <span> Total Supply : {supplyTotal} </span>
          <br />
          <span> Balance of : {addressBalanceOf} </span>          
          <br />
          ---------------------------------------------------------------------
      </div>
    )
  }

  function ViewDeployERC1404() {
    const [hash, setHash] = useState<undefined | `0x${string}`>();

    const walletClient: any = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum)   // declare    declare var window: any     on top
    })

    async function callContract() {
      const [account] = await walletClient.getAddresses()
      alert(account);
    }

    async function deployContract() {
      const [account] = await walletClient.getAddresses()

      try {

          const hashTemp = await walletClient.deployContract({
            abi: ERC1404Contract.abi,
            account: account,
            bytecode: ERC1404Contract.bytecode,
            args: [BigInt(1000000000000000000000), 'PPP2']
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
          --------------------------------------------------------------------------
          <h4>Viem - Deploy ERC1404</h4>
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
          <br />------------------------------------------------------------------------------
          <br />
      </span>
    )    
  }

  function VimeDeploySwapContract() {

    const [hash, setHash] = useState<undefined | `0x${string}`>();

    const walletClient: any = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum)   // declare    declare var window: any     on top
    })


    async function deployContract() {
      const [account] = await walletClient.getAddresses()

      try {

          const hashTemp = await walletClient.deployContract({
            abi: SwapperContract.abi,
            account: account,
            bytecode: SwapperContract.bytecode,
            args: []
          })

          setHash(hashTemp);          

      } catch(e: any) {
          alert(e.toString())
      }

    }

    const useWaitForTransactionObj = useWaitForTransaction({
      hash: hash,
    })


    function SendCloseTransactionToSwap() {

    }    

    return (
      <span>          
          --------------------------------------------------------------------------
          <h4>Viem - Deploy Swap</h4>
          <button  onClick={() => deployContract()}> Deploy </button>
          <button onClick={SendCloseTransactionToSwap}>Call Close</button>
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


          <br />------------------------------------------------------------------------------
          <br />
      </span>
    ) 

  }

  function ViemDeployERC20() {

    const [hash, setHash] = useState<undefined | `0x${string}`>();

    const walletClient: any = createWalletClient({
      chain: avalancheFuji,
      transport: custom(window.ethereum)   // declare    declare var window: any     on top
    })

    async function deployContract() {
      const [account] = await walletClient.getAddresses()

      try {

          const hashTemp = await walletClient.deployContract({
            abi: ERC20.abi,
            account: account,
            bytecode: ERC20.bytecode,
            args: [BigInt(100000000000000000000000),'TTT1']
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
          --------------------------------------------------------------------------
          <h4>Viem - Deploy ERC20</h4>
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
          <br />------------------------------------------------------------------------------
          <br />
      </span>
    ) 
  }

  
  function CallSwapCloseFunction() {

      const { config, error } = usePrepareContractWrite({
        address: '0x5A22dc69aFe095Ca86450864954536Ed67F3832F',
        abi: [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "originator",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "swapNumber",
                  "type": "uint256"
                }
              ],
              "name": "close",
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
        args: ['0x1a8929fbE9abEc00CDfCda8907408848cBeb5300', BigInt(103)],
        functionName: 'close'
      })
      const contractWtite = useContractWrite(config) 
    
      function call1() {
         alert(error)
         contractWtite.write?.()
      }

    return (
      <span> 

          <button onClick={() => call1()}>  Swap Close  </button>
        
      </span>      
    )

  }





}

export default Ethereum;


