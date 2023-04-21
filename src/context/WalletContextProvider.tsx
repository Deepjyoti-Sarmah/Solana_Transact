import { ReactNode, useMemo } from "react";
import { clusterApiUrl, Cluster } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  BackpackWalletAdapter,
  Coin98WalletAdapter,
  ExodusWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
  children: ReactNode;
  cluster: Cluster;
}

export default function WalletContextProvider({cluster, children} : WalletContextProviderProps) {
  const endpoint = clusterApiUrl(cluster);
  const network = WalletAdapterNetwork.Devnet;

  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter(),
      new Coin98WalletAdapter(),
      new ExodusWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    [network] 
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets = {wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );

}