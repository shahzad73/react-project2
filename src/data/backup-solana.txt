import React, { FC, useMemo, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';

import idl from '../data/solana_increment_idl.json';
import idl_twitter from '../data/solana_twitter_idl.json';


import { Program, AnchorProvider, web3, Keypair } from '@project-serum/anchor';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const SolanaComponent = () => {

    const web3 = require('@solana/web3.js');
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');


    const { SystemProgram, Keypair } = web3;
    const opts = {
      preflightCommitment: "processed"
    }    

    const wallet = useWallet();

    async function getProvider() {
      /* create the provider and return it to the caller */
      /* network set to local network for now */
      const network = "http://127.0.0.1:8899";
      const connection = new Connection(network, opts.preflightCommitment);
    
      const provider = new AnchorProvider(
        connection, wallet, opts.preflightCommitment,
      );
      return provider;
    }

    const baseAccount = Keypair.generate();
    const[currentRandomAccount, setCurrentRandomAccount] = useState( baseAccount )

    const [currentCounterValue, setCurrentCounterValue] = useState(null);
    
    async function createCounterRandomCounterProgram() {    
      const provider = await getProvider();
      /* create the program interface combining the idl, program ID, and provider */
      const programID = new PublicKey(idl.metadata.address);
      const program = new Program(idl, programID, provider);

      try {
        /* interact with the program via rpc */

        await program.rpc.create({
          accounts: {
            baseAccount: currentRandomAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [currentRandomAccount]
        });

        const account = await program.account.baseAccount.fetch(currentRandomAccount.publicKey);
        setCurrentCounterValue(account.count.toString());
      } catch (err) {
        console.log("Transaction error: ", err);
      }
    }

    async function incrementRandomCounterProgram() {
      const provider = await getProvider();
      const programID = new PublicKey(idl.metadata.address);
      const program = new Program(idl, programID, provider);
      await program.rpc.increment({
        accounts: {
          baseAccount: currentRandomAccount.publicKey
        }
      });
      
      const account = await program.account.baseAccount.fetch(currentRandomAccount.publicKey);
      console.log('account: ', account);
      setCurrentCounterValue(account.count.toString());
    }    




    async function createTweetAccount() {
      const provider = await getProvider();
      /* create the program interface combining the idl, program ID, and provider */
      const programID = new PublicKey("HsD1P5JYs1HR6oMmJX7yc5YojwxAWGYfR9AJ2qB5CPDf");
      const program = new Program(idl_twitter, programID, provider);

      const tweet = web3.Keypair.generate();

      try {
        /* interact with the program via rpc */
        const input_context = {
          accounts: {
            tweet: tweet.publicKey,
            author: provider.wallet.publicKey.toString(),
            systemProgram: SystemProgram.programId,
          },
          signers: [tweet]
        };

        await program.rpc.sendTweet("Topic 1", "Contents 1 1 1 1", input_context);
        alert("created with id " + tweet.publicKey);
        //const account = await program.account.baseAccount.fetch(currentRandomAccount.publicKey);
      } catch (err) {
        alert(err);
      }
    }

    async function getTweetAccount() {
      const provider = await getProvider();
      const programID = new PublicKey("HsD1P5JYs1HR6oMmJX7yc5YojwxAWGYfR9AJ2qB5CPDf");
      const program = new Program(idl_twitter, programID, provider);

      const account = await program.account.tweet.fetch("DFre3UA63AtLRfYFbjLQKoLp2MU91ppR39wjtjiBNSpS");

      alert(  JSON.stringify( account ) );
    }

    async function updateTweet() {
      const provider = await getProvider();
      const programID = new PublicKey("HsD1P5JYs1HR6oMmJX7yc5YojwxAWGYfR9AJ2qB5CPDf");
      const program = new Program(idl_twitter, programID, provider);

      await program.rpc.updateTweet("update topic 2", "update contents . . .. 12", {
        accounts: {
            author: provider.wallet.publicKey.toString(),
            tweet: "DFre3UA63AtLRfYFbjLQKoLp2MU91ppR39wjtjiBNSpS",
        },
      })      

      alert("updated . . . .")
    }







    return (
            <span>
                    Use following methods to interact with wallet once connected
                    <br />
                    The sendTransaction, signTransaction, signAllTransactions and signMessage methods enable us to sign messages and/or transactions on              
                    <br /><br />
                     <WalletMultiButton />
                    { wallet.connected && (<span> <WalletDisconnectButton />  <br /><br />  </span>  ) }                    
                    <br />
                    { wallet.ready && ( <span> Ready <br /></span> )} 
                    { wallet.connected && ( <span> Connected <br /></span> )} 
                    { wallet.connecting && ( <span> Connecting <br /></span> )} 
                    { wallet.disconnecting && ( <span> disconnecting<br /> </span> )} 
                    { !wallet.connected && ( <span> Dis-Connected </span> )}

                    <br /><br /><hr /><br />

                    <h3>Counter Example</h3>
                    <br />
                    <b>Currently Selected Random Account</b>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {currentRandomAccount.publicKey.toString()}
                    <br /><br />


                    <div>

                      {
                        currentCounterValue && currentCounterValue >= Number(0) ? (
                          <span>
                            <Button onClick={incrementRandomCounterProgram}>Increment counter</Button>
                            <br />
                            <span>Current Counter Value : <b>{currentCounterValue}</b></span>
                          </span>
                        ) : (
                          <span>
                            <b>Create the counter.</b> &nbsp; 
                            <Button onClick={createCounterRandomCounterProgram}>Create counter</Button>
                          </span>
                        )
                      }
                    </div>

                    <br /><br /><hr /><br />                    
                    

                    <h3>Twitter Example</h3>
                    <Button onClick={createTweetAccount}>Create Tweet</Button>
                    <Button onClick={getTweetAccount}>Get Tweet</Button>                    
                    <Button onClick={updateTweet}>Update Tweet</Button>                    

                    <br /><br /><hr /><br />                    


                    <h3>Token Program</h3>                    


                    <br /><br /><br />


            </span>
    );
};


const Solana = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Testnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
        ],
        [network]
    );

  return(
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
              <SolanaComponent />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )

};


export default Solana;






/*

-------------------------------
Increment Program 
-------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("D9F3A6hDaSACas2fdzaKckHquLWZtcQucuvATAceHmTe");

#[program]
mod mysolanaapp {
    use super::*;

    pub fn create(ctx: Context<Create>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;
        base_account.count += 1;
        Ok(())
    }
}

// Transaction instructions
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 16 + 16)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Transaction instructions
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// An account that goes inside a transaction instruction
#[account]
pub struct BaseAccount {
    pub count: u64,
}






-------------------------------
Tweet Program 
-------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("HsD1P5JYs1HR6oMmJX7yc5YojwxAWGYfR9AJ2qB5CPDf");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> ProgramResult {
        let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        if topic.chars().count() > 50 {
            return Err(ErrorCode::TopicTooLong.into())
        }

        if content.chars().count() > 280 {
            return Err(ErrorCode::ContentTooLong.into())
        }

        tweet.author = *author.key;
        tweet.timestamp = clock.unix_timestamp;
        tweet.topic = topic;
        tweet.content = content;

        Ok(())
    }

    pub fn update_tweet(ctx: Context<UpdateTweet>, topic: String, content: String) -> ProgramResult {
        let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet;

        if topic.chars().count() > 50 {
            return Err(ErrorCode::TopicTooLong.into())
        }

        if content.chars().count() > 280 {
            return Err(ErrorCode::ContentTooLong.into())
        }

        tweet.topic = topic;
        tweet.content = content;

        Ok(())
    }

    pub fn delete_tweet(_ctx: Context<DeleteTweet>) -> ProgramResult {
        Ok(())
    }
}

  #[derive(Accounts)]
  pub struct SendTweet<'info> {
      #[account(init, payer = author, space = Tweet::LEN)]
      pub tweet: Account<'info, Tweet>,
      #[account(mut)]
      pub author: Signer<'info>,
      #[account(address = system_program::ID)]
      /// CHECK: This is not dangerous because we don't read or write from this account
      pub system_program: AccountInfo<'info>,
  }

  #[derive(Accounts)]
  pub struct UpdateTweet<'info> {
      #[account(mut, has_one = author)]
      pub tweet: Account<'info, Tweet>,
      pub author: Signer<'info>,
  }

  #[derive(Accounts)]
  pub struct DeleteTweet<'info> {
      #[account(mut, has_one = author, close = author)]
      pub tweet: Account<'info, Tweet>,
      pub author: Signer<'info>,
  }

  #[account]
  pub struct Tweet {
      pub author: Pubkey,
      pub timestamp: i64,
      pub topic: String,
      pub content: String,
  }

  const DISCRIMINATOR_LENGTH: usize = 8;
  const PUBLIC_KEY_LENGTH: usize = 32;
  const TIMESTAMP_LENGTH: usize = 8;
  const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
  const MAX_TOPIC_LENGTH: usize = 50 * 4; // 50 chars max.
  const MAX_CONTENT_LENGTH: usize = 280 * 4; // 280 chars max.

  impl Tweet {
      const LEN: usize = DISCRIMINATOR_LENGTH
          + PUBLIC_KEY_LENGTH // Author.
          + TIMESTAMP_LENGTH // Timestamp.
          + STRING_LENGTH_PREFIX + MAX_TOPIC_LENGTH // Topic.
          + STRING_LENGTH_PREFIX + MAX_CONTENT_LENGTH; // Content.
  }

  #[error]
  pub enum ErrorCode {
      #[msg("The provided topic should be 50 characters long maximum.")]
      TopicTooLong,
      #[msg("The provided content should be 280 characters long maximum.")]
      ContentTooLong,
  }



*/