import { Button, Card, CardBody, CardFooter, Image as ChakraImage, Flex, HStack, Heading, Text, VStack, theme } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { ProductWithMetadata } from "../../types/product";
import { SaleWidgetParams, WidgetType } from "@imtbl/sdk/checkout";
import config, { applicationEnvironment } from "../../config/config";

interface PrimarySale {
  product: ProductWithMetadata;
}
export function PrimarySale({product}: PrimarySale) {
  const {walletAddress, provider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);
  const [quantity, setQuantity] = useState(1);

  function increment() {
    setQuantity((prev) => {
      if(prev === 20) return 20;
      return prev + 1;
    });
  }

  function decrement() {
    setQuantity((prev) => { 
      if(prev === 1) return 1;

      return prev - 1;
    });
  }

  async function handleBuyNow(product: ProductWithMetadata, quantity?: number) {
    openWidget(WidgetType.SALE, {
      language: 'en',
      environmentId: config[applicationEnvironment].hubEnvironmentId,
      collectionName: 'CryptoBirds',
      excludePaymentTypes: [],
      excludeFiatCurrencies: [],
      items: [{
        name: product.name,
        description: product.description,
        productId: product.id.toString(),
        qty: quantity ?? 1,
        image: product.metadata!.image
      }]
    } as SaleWidgetParams)
  }

  return (
    <Card minW="xs" w={["100%", "430px"]} bgColor={'rgba(0,0,0,0.75)'}>
      <CardBody>
        <VStack mt="6" gap={4} alignItems={"center"}>
          <Heading size="lg">{product.name}</Heading>
          <Flex w={"100%"} flexDir={"row"} justifyContent={"space-between"} alignItems={"center"}> 
          </Flex>
          {product.metadata?.image && <ChakraImage 
            src={product.metadata?.image} 
            alt="Example Image"
            height={"400px"}
            borderRadius={theme.radii.md}
            />}
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        <HStack justifyContent={'space-between'}>
          <HStack>
            <ChakraImage src={"https://checkout-cdn.sandbox.immutable.com/v1/blob/img/tokens/0x3b2d8a1931736fc321c24864bceee981b11c3c57.svg"} height={6} />
            <Text>{`${product.pricing[0].currency} ${product.pricing[0].amount}`}</Text>
          </HStack>
          <HStack gap={2}>
            <Button borderRadius={"100%"} fontWeight={"bold"} onClick={decrement} aria-label={"decrement"}>-</Button>
            <Text fontWeight={"bold"}>{quantity}</Text>
            <Button borderRadius={"100%"} fontWeight={"bold"} onClick={increment} aria-label={"increment"}>+</Button>
          </HStack>
          <Button 
          variant="solid" 
          colorScheme="blue"
          isDisabled={(!walletAddress || !provider)} 
          onClick={() => handleBuyNow(product, quantity)}
          >
            Buy now
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}