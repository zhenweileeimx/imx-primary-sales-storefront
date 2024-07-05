import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { EIP1193Provider } from "../contexts/EIP1193Context";

export function useImxBalance(provider: EIP1193Provider, address: string) {
  const [imxBalance, setImxBalance] = useState(new BigNumber(0));
  const [loading, setLoading] = useState(false);

  // fetch balance for walletAddress
  useEffect(() => {
    if (!provider || !address) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (provider as any).request({ method: 'eth_getBalance', params: [address, 'latest'] })
      .then((balance: string) => {
        setImxBalance(new BigNumber(balance))
        setLoading(false);
      })
  }, [provider, address])

  return {
    loading,
    balance: imxBalance,
    formattedBalance: (imxBalance.div(new BigNumber(10 ** 18))).toString() // format as IMX has 18 decimals
  }
}