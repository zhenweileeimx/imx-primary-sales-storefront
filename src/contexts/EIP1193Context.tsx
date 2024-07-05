import { createContext, useEffect, useState } from "react";
import { ExternalProvider } from "@ethersproject/providers";

export type EIP1193Provider = ExternalProvider & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (eventType: string, handler: (...args: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener: (eventType: string, handler: (...args: any) => void) => void;
}
export interface EIP1193ContextState {
  provider: EIP1193Provider | null;
  setProvider: (provider: EIP1193Provider | null) => void;
  chainId: number | null;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  isPassportProvider: boolean;
}

export const EIP1193Context = createContext<EIP1193ContextState>({
  provider: null,
  setProvider: () => {},
  chainId: null,
  walletAddress: '',
  setWalletAddress: () => {},
  isPassportProvider: false
});

interface EIP1193ContextProvider {
  children: React.ReactNode;
}
export const EIP1193ContextProvider = ({children}: EIP1193ContextProvider) => {
  const [provider, setProvider] = useState<EIP1193Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState<number | null>(null);
  const [isPassport, setIsPassport] = useState(false);

  useEffect(() => {
    if(!provider) {
      setWalletAddress('');
      setChainId(null);
      setIsPassport(false);
      return;
    }
    const getProviderDetails = async () => {
      setChainId(await provider.request!({method: 'eth_chainId'}));
      setWalletAddress((await provider.request!({method: 'eth_accounts'}))[0].toLowerCase() ?? '')
    }
    setProvider(provider as EIP1193Provider);
    getProviderDetails();
  }, [provider]);

  useEffect(() => {
    if(!provider) return;

    function setChain(network: string) {
      console.log(network);
      setChainId(parseInt(network))
    }
    function setAccount(accounts: string[]) {
      console.log(accounts);
      setWalletAddress(accounts[0] ?? '');
    }
    provider.on('chainChanged', setChain);
    provider.on('accountsChanged', setAccount);

    return () => {
      provider.removeListener('chainChanged', setChain);
      provider.removeListener('accountsChanged', setAccount);
    }
  }, [provider])

  return (
    <EIP1193Context.Provider value={{
      provider, 
      setProvider,
      chainId,
      walletAddress,
      setWalletAddress,
      isPassportProvider: isPassport,
      }}>
      {children}
    </EIP1193Context.Provider>
  )

}
