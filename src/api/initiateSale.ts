import { Contract } from "@ethersproject/contracts"
import { TransactionResponse, Web3Provider } from "@ethersproject/providers"

const SALE_CONTRACT = "0x1B0C4d3788f9A89c96B99666E909095364d6b203";

export async function initiateSale(provider: Web3Provider) {
  const signer = provider.getSigner();
  const saleContract = new Contract(
    SALE_CONTRACT,
    ["function buyOne()"],
    signer
  );
  const txResponse = await saleContract.buyOne() as TransactionResponse;
  console.log(txResponse);

  const txReceipt = await txResponse.wait();
  console.log(txReceipt);
  return txReceipt;
}