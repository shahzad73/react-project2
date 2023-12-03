import '../App.css';
import React from 'react';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { BrowserExtensionSigningManager } from '@polymeshassociation/browser-extension-signing-manager';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';


const Main =  () => {

  const items = [
    {
      header: 'Project Report - April',
      description:
        'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      meta: 'ROI: 30%',
    },
    {
      header: 'Project Report - May',
      description:
        'Bring to the table win-win survival strategies to ensure proactive domination.',
      meta: 'ROI: 34%',
    },
  ]

    async () => {
        // setup. This call will prompt the user if they haven't authorized the dApp before
        const signingManager = await BrowserExtensionSigningManager.create({
          appName: 'my-dApp',
          //extensionName: 'polywallet', // this is optional, defaults to 'polywallet'
        });

        const polymesh = await Polymesh.connect({
          nodeUrl: "wss://testnet-rpc.polymesh.live",
          signingManager,
        });

        // callback is called whenever the extension Accounts change
        signingManager.onAccountChange(newAccounts => {
          // change SDK's signing account, reload the page, do whatever
          alert( newAccounts )
        });

        // callback is called whenever the extension's selected network changes
        signingManager.onNetworkChange(newNetwork => {
          // act accordingly
          alert( newNetwork )
        });

      }
      

  return (
    <div>
        <Card.Group centered items={items} />        
    </div>
  );
}

export default Main;