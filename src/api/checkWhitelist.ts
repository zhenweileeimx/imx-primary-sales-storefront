import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"

const SALE_CONTRACT = "0x1B0C4d3788f9A89c96B99666E909095364d6b203";

export async function checkWhitelist(provider: Web3Provider) {
  const signer = provider.getSigner();
  const user = await signer.getAddress();
  const saleContract = new Contract(
    SALE_CONTRACT,
    ["function _whitelist(address) public view returns (uint256)"],
    signer
  );
  const whitelisted = await saleContract._whitelist(user.toLowerCase());
  console.log(`whitelisted: ${whitelisted}`);
  return parseInt(whitelisted.toString());
}