import { Contract } from "@ethersproject/contracts"
import { TransactionResponse, Web3Provider } from "@ethersproject/providers"
import { BigNumber } from "@ethersproject/bignumber"

const CURRENCY_CONTRACT = "0x3B2d8A1931736Fc321C24864BceEe981B11c3c57";
const SALE_CONTRACT = "0x1B0C4d3788f9A89c96B99666E909095364d6b203";
export const PRICE = BigNumber.from("1000000");

export async function approveSpending(provider: Web3Provider, amount: string) {
  const signer = provider.getSigner();
  const spender = SALE_CONTRACT;

  const currencyContract = new Contract(
    CURRENCY_CONTRACT,
    ["function approve(address,uint256)"],
    signer
  );
  const txResponse = await currencyContract.approve(spender, amount) as TransactionResponse;
  console.log(txResponse);
  const txReceipt = await txResponse.wait();
  console.log(txReceipt);
  return txReceipt;
}