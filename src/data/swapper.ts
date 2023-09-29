export const SwapperContract = {
    abi: [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "originator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "executor",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "openingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokensToOpen",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "closingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokensToClose",
              "type": "uint256"
            }
          ],
          "name": "Closed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "originator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "executor",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "openingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokensToOpen",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "closingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "swapNumber",
              "type": "uint256"
            }
          ],
          "name": "Expired",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "originator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "executor",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "openingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokensToOpen",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "closingToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokensToClose",
              "type": "uint256"
            }
          ],
          "name": "Opened",
          "type": "event"
        },
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
        },
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
          "name": "expire",
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
              "name": "originator",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "swapNumber",
              "type": "uint256"
            }
          ],
          "name": "getSwapData",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "executor",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "openingToken",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokensToOpen",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "closingToken",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokensToClose",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "expiry",
                  "type": "uint256"
                },
                {
                  "internalType": "enum TokenSwapper.States",
                  "name": "status",
                  "type": "uint8"
                }
              ],
              "internalType": "struct TokenSwapper.Swap",
              "name": "",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "swapState",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "swapNumber",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_executor",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_openingToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_tokensToOpen",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "_closingToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_tokensToClose",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_expiry",
              "type": "uint256"
            }
          ],
          "name": "open",
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
    bytecode: "0x608060405234801561001057600080fd5b5061116b806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630ab88e5a146100515780636a710fd01461007b578063746b31c01461009e578063e49280cb146100b1575b600080fd5b61006461005f366004610ee0565b6100c4565b604051610072929190610f20565b60405180910390f35b61008e610089366004610fa3565b6101ca565b6040519015158152602001610072565b61008e6100ac366004610ee0565b6107a9565b61008e6100bf366004610ee0565b610977565b6101016040805160e081018252600080825260208201819052918101829052606081018290526080810182905260a081018290529060c082015290565b6001600160a01b038084166000908152602081815260408083208684528252808320815160e0810183528154861681526001820154861693810193909352600281015491830191909152600380820154909416606083015260048101546080830152600581015460a083015260068101549293849360c084019160ff9091169081111561019057610190610f0a565b60038111156101a1576101a1610f0a565b815250509050808160c0015160038111156101be576101be610f0a565b92509250509250929050565b336000908152602081815260408083208a8452909152812060050154156102465760405162461bcd60e51b815260206004820152602560248201527f546f6b656e537761707065723a20737761704e756d62657220616c7265616479604482015264081d5cd95960da1b60648201526084015b60405180910390fd5b4282111580610261575061025e426301e1338061100d565b82115b156102e65760405162461bcd60e51b815260206004820152604960248201527f546f6b656e537761707065723a206578706972792073686f756c64206265206960448201527f6e206675747572652c20627574206c657373207468616e202f20657175616c206064820152683a379030903cb2b0b960b91b608482015260a40161023d565b6001600160a01b03871661034f5760405162461bcd60e51b815260206004820152602a60248201527f546f6b656e537761707065723a204578656375746572206164647265737320636044820152690616e6e6f7420626520360b41b606482015260840161023d565b6001600160a01b0386166103bd5760405162461bcd60e51b815260206004820152602f60248201527f546f6b656e537761707065723a204f70656e696e6720546f6b656e206164647260448201526e06573732063616e6e6f74206265203608c1b606482015260840161023d565b6001600160a01b03841661042b5760405162461bcd60e51b815260206004820152602f60248201527f546f6b656e537761707065723a20636c6f73696e6720746f6b656e206164647260448201526e06573732063616e6e6f74206265203608c1b606482015260840161023d565b836001600160a01b0316866001600160a01b0316036104c05760405162461bcd60e51b8152602060048201526044602482018190527f546f6b656e537761707065723a204f70656e696e67546f6b656e20616e642043908201527f6c6f73696e67546f6b656e206164647265737365732063616e6e6f742062652060648201526373616d6560e01b608482015260a40161023d565b8460000361051f5760405162461bcd60e51b815260206004820152602660248201527f546f6b656e537761707065723a20546f6b656e73546f4f70656e2063616e6e6f60448201526507420626520360d41b606482015260840161023d565b8260000361057f5760405162461bcd60e51b815260206004820152602760248201527f546f6b656e537761707065723a20546f6b656e73546f436c6f73652063616e6e60448201526606f7420626520360cc1b606482015260840161023d565b336000908152602081815260408083208b84528252808320815160e08101835281546001600160a01b0390811682526001830154811694820194909452600282015492810192909252600380820154909316606083015260048101546080830152600581015460a083015260068101549192909160c084019160ff9091169081111561060d5761060d610f0a565b600381111561061e5761061e610f0a565b8152505090506040518060e00160405280896001600160a01b03168152602001886001600160a01b03168152602001878152602001866001600160a01b031681526020018581526020018481526020016001600381111561068157610681610f0a565b9052336000908152602081815260408083208d8452825291829020835181546001600160a01b03199081166001600160a01b03928316178355928501516001808401805486169284169290921790915593850151600283015560608501516003808401805490951691909216179092556080840151600482015560a0840151600582015560c0840151600682018054959650869592949193909260ff19169190849081111561073257610732610f0a565b021790555088915061074890508133308a610bd2565b876001600160a01b0316336001600160a01b03167fc9e7a6a165cfaa5c0c0d59279f54fdad83bdb97a2e51359aefde5e702352de1a8b8a8a8a604051610791949392919061102e565b60405180910390a35060019998505050505050505050565b6001600160a01b0382166000908152602081815260408083208484529091528120600501546107ea5760405162461bcd60e51b815260040161023d90611058565b6001600160a01b03831660009081526020818152604080832085845290915290206001600682015460ff16600381111561082657610826610f0a565b146108735760405162461bcd60e51b815260206004820152601b60248201527f546f6b656e537761707065723a2073776170206e6f74206f70656e0000000000604482015260640161023d565b806005015442116108d15760405162461bcd60e51b815260206004820152602260248201527f546f6b656e537761707065723a2073776170206e6f7420796574206578706972604482015261195960f21b606482015260840161023d565b60068101805460ff19166003179055600181015460028201546001600160a01b03909116906109039082908790610c43565b600182015482546002840154600385015460048601546040516001600160a01b03958616958b8116957f05adf21dc19122ab9e1dfdcfeb5958f3139422eb3c4bc2c26b6539082baf83e69561096295918316949093929091169161102e565b60405180910390a36001925050505b92915050565b6001600160a01b0382166000908152602081815260408083208484529091528120600501546109b85760405162461bcd60e51b815260040161023d90611058565b6001600160a01b03831660009081526020818152604080832085845290915290206001600682015460ff1660038111156109f4576109f4610f0a565b14610a415760405162461bcd60e51b815260206004820152601b60248201527f546f6b656e537761707065723a2073776170206e6f74206f70656e0000000000604482015260640161023d565b80546001600160a01b03163314610aa85760405162461bcd60e51b815260206004820152602560248201527f546f6b656e537761707065723a20696e636f727265637420737761702065786560448201526431baba37b960d91b606482015260840161023d565b8060050154421115610b085760405162461bcd60e51b8152602060048201526024808201527f546f6b656e537761707065723a20737761702065787069726174696f6e2070616044820152631cdcd95960e21b606482015260840161023d565b60068101805460ff19166002179055600381015460048201546001600160a01b0390911690610b3c90829033908890610bd2565b600182015460028301546001600160a01b0390911690610b5f9082903390610c43565b600183015483546002850154600386015460048701546040516001600160a01b03958616958c8116957f0863c99ca1d63deac537273e43e63f1d134ef02de0ef56bc41280cf200a98f7195610bbe95918316949093929091169161102e565b60405180910390a350600195945050505050565b6040516001600160a01b0380851660248301528316604482015260648101829052610c3d9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610c78565b50505050565b6040516001600160a01b038316602482015260448101829052610c7390849063a9059cbb60e01b90606401610c06565b505050565b6000610ccd826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610d4a9092919063ffffffff16565b805190915015610c735780806020019051810190610ceb91906110a0565b610c735760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161023d565b6060610d598484600085610d63565b90505b9392505050565b606082471015610dc45760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161023d565b843b610e125760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161023d565b600080866001600160a01b03168587604051610e2e91906110e6565b60006040518083038185875af1925050503d8060008114610e6b576040519150601f19603f3d011682016040523d82523d6000602084013e610e70565b606091505b5091509150610e80828286610e8b565b979650505050505050565b60608315610e9a575081610d5c565b825115610eaa5782518084602001fd5b8160405162461bcd60e51b815260040161023d9190611102565b80356001600160a01b0381168114610edb57600080fd5b919050565b60008060408385031215610ef357600080fd5b610efc83610ec4565b946020939093013593505050565b634e487b7160e01b600052602160045260246000fd5b60006101008201905060018060a01b0380855116835280602086015116602084015260408501516040840152806060860151166060840152506080840151608083015260a084015160a083015260c084015160048110610f9057634e487b7160e01b600052602160045260246000fd5b60c083015260e090910191909152919050565b600080600080600080600060e0888a031215610fbe57600080fd5b87359650610fce60208901610ec4565b9550610fdc60408901610ec4565b945060608801359350610ff160808901610ec4565b925060a0880135915060c0880135905092959891949750929550565b8082018082111561097157634e487b7160e01b600052601160045260246000fd5b6001600160a01b039485168152602081019390935292166040820152606081019190915260800190565b60208082526028908201527f546f6b656e537761707065723a20737761704e756d62657220646f6573206e6f604082015267742065786973747360c01b606082015260800190565b6000602082840312156110b257600080fd5b81518015158114610d5c57600080fd5b60005b838110156110dd5781810151838201526020016110c5565b50506000910152565b600082516110f88184602087016110c2565b9190910192915050565b60208152600082518060208401526111218160408501602087016110c2565b601f01601f1916919091016040019291505056fea26469706673582212200ff8cff03795bb913a562e745f8dfca46a31f2e8ac9e3a6297e6a506d0953f3664736f6c63430008140033"
} as const




