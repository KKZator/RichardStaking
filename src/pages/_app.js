import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  braveWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
  coinbaseWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { NextUIProvider, createTheme} from '@nextui-org/react';
import HomePage from '@/components/HomePage';
import ParticleBG from '@/components/ParticleBG';
import Layout, { MainLayout } from '@/components/Layout';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const kkTest ={
  id:31337,
  name:"KKTeam Testnet",
  network:"https://rpc.kkteam.net/kktests",
  iconBackground:"#000000",
  nativeCurrency:  {
    decimals:18,
    name:'Go',
    symbol:'Go'
  },
  rpcUrls:{
    default:{
      http:["https://rpc.kkteam.net/kktests"]
// public rpc url
    },
    public: {
      http:["https://rpc.kkteam.net/kktests"]
    }
  },
  
  testnet:true

}


const { chains, provider } = configureChains(
  [ kkTest],
  [   
    jsonRpcProvider({
      rpc: chain => ({ http: chain.rpcUrls.default.http[0] }),
    })
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Inject your wallet',
    wallets: [injectedWallet({ chains })]
  },
  {
    groupName: 'Select your wallet',
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      trustWallet({ chains, shimDisconnect: true }),
      coinbaseWallet({ appName: 'EkoExchange', chains })
    ]
  },
  {
    groupName: 'Others',
    wallets: [
      walletConnectWallet({ chains }),
      ledgerWallet({ chains }),
      braveWallet({ chains }),
      argentWallet({ chains }),
      imTokenWallet({ chains }),
      omniWallet({ chains }),
      rainbowWallet({ chains })
    ]
  }
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const darkThemez = createTheme({
  type: 'dark',  
});







export default function App({ Component, pageProps }) {
  return (
    <NextUIProvider theme={darkThemez}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({accentColor: '#F6903F', accentColorForeground: 'black'})}>
          <MainLayout>
            <Component {...pageProps} /> 
            
            <ParticleBG />  
          </MainLayout>                
        </RainbowKitProvider>
      </WagmiConfig>
    </NextUIProvider>
    )
}