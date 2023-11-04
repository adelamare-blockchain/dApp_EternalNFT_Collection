'use client';

// Librairies
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

// Components
import Loader from '@/components/Loader/Loader';
import EternalNFT from '@/artifacts/contracts/EternalNFT.sol/EternalNFT.json';
import { nftContractAddress } from '@/config/page';
import { Island_Moments } from 'next/font/google';

// MAIN FUNCTION
export default function Index() {
  // STATES
  // State 0 - useAccount
  const [isLoading, setIsLoading] = useState(false);
  // State 1 - nfts
  const [nfts, setNfts] = useState([]);
  // State 2 - MintedNFT
  const [mintedNFT, setMintedNFT] = useState(null);
  // State 3 - miningSatus
  const [miningStatus, setMiningStatus] = useState(null);
  // State 4 - LoadingState
  const [loadingState, setLoadingState] = useState(0);
  // State 5 - txError
  const [txError, setTxError] = useState(null);
  // State 6 - currentAccount
  const [currentAccount, setCurrentAccount] = useState('');
  // State 7 - correctNetwork
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // VARIABLES
  let signer;
  let contract;

  // METHODES
  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        setIsLoading(true);
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        signer = provider.getSigner();
        contract = new ethers.Contract(
          nftContractAddress,
          EternalNFT.abi,
          signer
        );
        const chainId = await provider
          .getNetwork()
          .then((network) => network.chainId);

        const goerliChainId = 5;
        const devChainId = 1337;
        if (chainId !== goerliChainId && chainId !== devChainId) {
          toast.error(
            <>'You are not connected to the Goerli Testnet!'</>
          );

          return;
        }
        const accounts = await provider.listAccounts();
        console.log('Found account', accounts[0]);
        setCurrentAccount(accounts[0]);
        setIsLoading(false);
        return toast.success(
          <>
            Wallet {accounts[0]} <br />
            <b>Connected to chain {chainId}</b>
            <br />
            connecté.
          </>
        );
      } else {
        toast.error(
          <>
            Vous devez installer Metamask. Veuillez installer
            l'extension{' '}
            <span>
              <a
                href='https://metamask.io/'
                target='_blank'
                rel='noreferrer'
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: '600',
                  justifyContent: 'ce',
                }}>
                ICI
              </a>
            </span>
          </>
        );
      }
    } catch (error) {
      toast.error(<>Error connecting wallet : {error}</>);
    }
  };

  // Checks if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        console.log(`Got the ethereum object : ${window.ethereum}`);
      } else {
        toast.error(<>No Wallet found. Connect Wallet</>);
      }
      setIsLoading(true);

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length !== 0) {
        setCurrentAccount(accounts[0]);
        console.log(`Found authorized Account: ${accounts[0]}`);
      } else {
        toast.error(<>No authorized account found</>);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        setIsLoading(true);
        const chainId = await provider
          .getNetwork()
          .then((network) => network.chainId);
        console.log('Connected to chain:', chainId);
        const goerliChainId = 5;
        const devChainId = 1337;
        if (chainId !== goerliChainId && chainId !== devChainId) {
          setCorrectNetwork(false);
        } else {
          setCorrectNetwork(true);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(<>{error}</>);
    }
  };

  // Méthode 2 - Creates transaction to mint NFT on clicking Mint Character button
  const mintCharacter = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        signer = provider.getSigner();

        contract = new ethers.Contract(
          nftContractAddress,
          EternalNFT.abi,
          provider
        );

        setIsLoading(true);
        const nftTx = await contract
          .connect(signer)
          .createEternalNFT();
        console.log('Mining....', nftTx.hash);
        setMiningStatus(0);

        const tx = await nftTx.wait();
        setLoadingState(1);
        console.log('Mined!', tx);
        const event = tx.events[0];
        const value = event.args[2];
        const tokenId = value.toNumber();
        setIsLoading(false);

        toast.success(
          <>
            Mined, see transaction: https://goerli.etherscan.io/tx/$
            {nftTx.hash}
          </>
        );
        getMintedNFT(tokenId);
      } else {
        setIsLoading(false);
        toast.error(<>Ethereum object doesn't exist!</>);
      }
    } catch (error) {
      console.error(error);
      console.log('Error minting character', error);
      setTxError(error.message);
    }
  };

  // Méthode 3 - Show already minted NFTs of one user
  const getUserNFTs = async () => {
    try {
      if (window.ethereum) {
        // 1) Mise en place du provider
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        // 2) mise en place du signer
        const signer = provider.getSigner();

        // 3) Interaction du signer avec smart contract
        const contract = new ethers.Contract(
          nftContractAddress,
          EternalNFT.abi,
          provider
        );

        // Accounts du signer
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          console.log('No authorized account found');
          return;
        }

        // 4) Récupération de tx => balance des nfts du signer
        const tx = await contract
          .connect(signer)
          .balanceOf(accounts[0]);

        // 5) Récupération de tokenIds
        const tokenIds = tx.toNumber();

        setIsLoading(true);
        const mintedNfts = [];
        for (let i = 0; i < tokenIds; i++) {
          // Récupération de l'owner des nfts
          const owner = await contract.ownerOf(i + 1);

          // Boucle for pour retrouver tous les NFT du owner
          if (owner === accounts[0]) {
            const tokenUri = await contract.tokenURI(i);
            const response = await axios.get(tokenUri);
            const meta = response.data;

            // Nft individuel
            let nft = {
              tokenId: i,
              name: meta.name,
              description: meta.description,
              image: meta.image,
            };
            mintedNfts.push(nft);
          }
        }
        setIsLoading(false);
        setNfts(mintedNfts);

        // // 6) Création d'un tableau de tokenIds
        // const tokenIdsCount = Array.from(Array(tokenIds).keys());
        // const mintedNfts = await Promise.all(
        //   tokenIdsCount.map(async (tokenId) => {
        //     const owner = await contract.ownerOf(tokenId + 1);
        //     console.log(`Owner : ${owner}`);
        //     if (owner === accounts[0]) {
        //       const tokenUri = await contract.tokenURI(tokenId);
        //       const response = await axios.get(tokenUri);
        //       const meta = response.data;
        //       const nft = {
        //         tokenId: tokenId,
        //         name: meta.name,
        //         description: meta.description,
        //         image: meta.image,
        //       };
        //       return nft;
        //     }
        //   })
        // );
        // console.log(`minted NFTs : ${JSON.stringify(mintedNfts)}`);
        // return mintedNfts;
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error(<>Error getting user NFTs: {error.message}</>);
      return [];
    }
  };

  // Méthode 5 - Gets the minted NFT data
  const getMintedNFT = async (tokenId) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        signer = provider.getSigner();
        contract = new ethers.Contract(
          nftContractAddress,
          EternalNFT.abi,
          signer
        );
        const tokenUri = await contract.tokenURI(tokenId);
        const response = await axios.get(tokenUri);
        const meta = response.data;
        setMiningStatus(1);
        setMintedNFT(meta.image);
      }
    } catch (error) {
      console.error(error);
      setTxError(error.message);
    }
  };

  // Component DidMount (USEEFFECT)
  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
    getUserNFTs();
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {isLoading && <Loader />}
      <div className='flex flex-col items-center pt-32 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
        <div className='transition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='60'
            height='60'
            fill='currentColor'
            viewBox='0 0 16 16'>
            <path d='M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z' />
          </svg>
        </div>
        <h2 className='text-center text-3xl font-bold mb-20 mt-12'>
          Mint your Eternal Domain NFT !
        </h2>

        {/* LOADING */}
        {currentAccount === '' ? (
          <>
            <button
              className='text-center text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
              onClick={connectWallet}>
              Connect Wallet
            </button>
          </>
        ) : correctNetwork ? (
          <>
            <button
              className='text-center text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
              onClick={mintCharacter}>
              Mint Character
            </button>
          </>
        ) : (
          <>
            <div className='flex flex-col justify-center text-center items-center mb-20 font-bold text-2xl gap-y-3'>
              <div>----------------------------------------</div>
              <div>Please connect to the Goerli Testnet</div>
              <div>and reload the page</div>
              <div>----------------------------------------</div>
            </div>
          </>
        )}

        <div className='text-center text-xl font-semibold mb-20 mt-4'>
          <a
            href={`https://testnet.rarible.com/collection/${nftContractAddress}`}
            target='_blank'>
            <span className='hover:underline hover:underline-offset-8 '>
              View Collection on Rarible
            </span>
          </a>
        </div>

        {loadingState === 0 ? (
          miningStatus === 0 ? (
            txError === null ? (
              <>
                <div className='flex flex-col justify-center items-center'>
                  <div className='text-lg font-bold'>
                    Processing your transaction
                  </div>
                </div>
              </>
            ) : (
              <div className='text-lg text-red-600 font-semibold'>
                {txError.message}
              </div>
            )
          ) : (
            <>
              {isLoading && <Loader />}
              {nfts.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4'>
                  {nfts.map((nft, index) => (
                    <img
                      key={index}
                      src={nft.image}
                      alt=''
                      className='h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out'
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className='text-center text-lg text-red-600 font-semibold'>
                    No minted NFTs found.
                  </div>
                </>
              )}
            </>
          )
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <div className='font-semibold text-lg text-center mb-4'>
              Your Eternal Domain Character
            </div>
            {isLoading && <Loader />}
            {mintedNFT && (
              <img
                src={mintedNFT}
                alt=''
                className='h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out'
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer
        autoClose='6000'
        position='bottom-right'
        theme='dark'
      />
    </main>
  );
}
