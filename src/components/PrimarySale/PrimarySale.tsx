import { Button, Card, CardBody, CardFooter, Image as ChakraImage, Flex, HStack, Heading, Link, Spinner, Text, VStack, theme, useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { MintStatus } from "../MintStatus/MintStatus";
import { WidgetType } from "@imtbl/sdk/checkout";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { checkWhitelist } from "../../api/checkWhitelist";
import { Web3Provider } from "@ethersproject/providers";
import { checkAllowance } from "../../api/checkAllowance";
import { PRICE, approveSpending } from "../../api/approveSpending";
import { initiateSale } from "../../api/initiateSale";

export function PrimarySale() {
  const {walletAddress, provider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);

  // Local state
  const [loading, setLoading] = useState(false);
  const [mintId, setMintId] = useState<string | null>(null);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<number>(0);

  console.log(`eligibility result ${eligibilityResult}`)

  const toast = useToast();

  const checkEligibility = useCallback(async (provider: Web3Provider) => {
    setEligibilityLoading(true);
    try {
      const result = await checkWhitelist(provider);
      setEligibilityResult(result)
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to check mint eligibility",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setEligibilityLoading(false);
    }
  },[toast]);

  const handleCheckAllowance = useCallback(async() => {
    if(!provider) return;
    setLoading(true)
    try{
      const allowance = await checkAllowance(provider);
      if(allowance.gte(PRICE)) {
        toast({
          status: 'success',
          title: "You have approved enough USDC to spend",
          position: 'bottom-right',
          duration: 4000
        })
      } else {
        toast({
          status: 'error',
          title: "You must approve 1 USDC before purchasing",
          position: 'bottom-right',
          duration: 4000
        })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [provider, toast])

  const handleApproveSpending = useCallback(async() => {
    if(!provider) return;
    setLoading(true)
    try{
      const txReceipt = await approveSpending(provider, "1000000");
      if(txReceipt.status === 1) {
        toast({
          status: 'success',
          title: "You can now buy a CryptoBird",
          position: 'bottom-right',
          duration: 4000
        })
      } else {
        toast({
          status: 'error',
          title: "Something went wrong when approving USDC to spend",
          position: 'bottom-right',
          duration: 4000
        })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [provider, toast])

  const handleRevokeSpending = useCallback(async() => {
    if(!provider) return;
    setLoading(true)
    try{
      const txReceipt = await approveSpending(provider, "0");
      if(txReceipt.status === 1) {
        toast({
          status: 'success',
          title: "You have revoked all USDC spend allowance",
          position: 'bottom-right',
          duration: 4000
        })
      } else {
        toast({
          status: 'error',
          title: "Something went wrong when revoking USDC to spend",
          position: 'bottom-right',
          duration: 4000
        })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  },[provider, toast])

  const handleBuyNFT = useCallback(async() => {
    if(!provider) return;
    setLoading(true)
    try{
      const txReceipt = await initiateSale(provider);
      if(txReceipt.status === 1) {
        toast({
          status: 'success',
          title: <Text color={theme.colors.black}>Purchase successful. <Link color={theme.colors.pink["500"]} target="_blank" href={`https://explorer.testnet.immutable.com/tx/${txReceipt.transactionHash}`}>See your bird</Link></Text>,
          position: 'bottom-right',
          duration: 4000
        })
      } else {
        toast({
          status: 'error',
          title: "Something went wrong. You have not been charged.",
          position: 'bottom-right',
          duration: 4000
        })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [provider, toast])

  // get mint config on load
  // useEffect(() => {
  //   fetchMintConfiguration();
  // }, [fetchMintConfiguration]);

  // check eligibility when user connects
  useEffect(() => {
    if(!walletAddress || !provider) {
      setMintId(null);
      setEligibilityResult(0);
    } else {
      checkEligibility(provider);
    }
  }, [walletAddress, provider, checkEligibility])

  return (
    <Card minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg">CryptoBirds Primary Sale</Heading>
          <Text>Mint your CryptoBirds here for 1 USDC (test)</Text>
          <Flex w={"100%"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"}> 
          <Link color={theme.colors.pink["500"]} target="_blank" size={"small"} href={"https://explorer.testnet.immutable.com/address/0xEc672172B6dc766Bc9656086b97B17162946e815"}>
            CryptoBirds contract
          </Link>
          <Link color={theme.colors.pink["500"]} target="_blank" size={"small"} href={"https://explorer.testnet.immutable.com/address/0x1B0C4d3788f9A89c96B99666E909095364d6b203"}>
            Sale Contract
          </Link>
          </Flex>
          <ChakraImage 
            src="https://zacharycouchman.github.io/nft-project-metadata-immutable/cryptobirds.webp" 
            alt="Example Image"
            width={["250px", "300px"]}
            borderRadius={theme.radii.md}
            />
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
          {(!walletAddress || !provider) && <Button variant="solid" colorScheme='blue' onClick={() => openWidget(WidgetType.CONNECT)}>Connect Wallet</Button>}
          {loading && <Spinner />}
          {!loading && provider && walletAddress && eligibilityResult === 0 && <Text>You are not whitelisted for this sale</Text>}
          {(provider && !loading && eligibilityResult !== 0) && (
            <HStack gap={4} mb={4}>
            <Button variant="solid" colorScheme="blue" onClick={handleCheckAllowance}>Check Allowance</Button>
            <Button variant="solid" colorScheme="blue" onClick={handleApproveSpending}>Approve 1 USDC</Button>
            <Button variant="solid" colorScheme="blue" onClick={handleRevokeSpending}>Revoke</Button>
            </HStack>
          )}
          {(walletAddress && provider && eligibilityResult !== 0 && !eligibilityLoading && !loading) && (
            <Button 
            variant="solid" 
            colorScheme="blue" 
            isDisabled={eligibilityResult === 0
              || loading 
              || Boolean(mintId)
            }
            onClick={handleBuyNFT}
            >
              Buy now
            </Button>
          )}
          {mintId && walletAddress && <MintStatus mintId={mintId} walletAddress={walletAddress} />}
      </CardFooter>
    </Card>
  );
}