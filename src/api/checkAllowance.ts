import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { BigNumber } from "@ethersproject/bignumber"

const CURRENCY_CONTRACT = "0x3B2d8A1931736Fc321C24864BceEe981B11c3c57";
const SALE_CONTRACT = "0x1B0C4d3788f9A89c96B99666E909095364d6b203";

export async function checkAllowance(provider: Web3Provider) {
  const signer = provider.getSigner();
  const owner = await signer.getAddress();
  const spender = SALE_CONTRACT;

  const currencyContract = new Contract(
    CURRENCY_CONTRACT,
    ["function allowance(address,address) public view returns(uint256)"],
    signer
  );
  const allowance = await currencyContract.allowance(owner, spender) as BigNumber;
  console.log(allowance.toString());
  return allowance;
}