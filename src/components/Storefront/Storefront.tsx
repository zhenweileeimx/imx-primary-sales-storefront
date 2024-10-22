import { HStack, Spinner, useToast, Button, Box, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { checkout } from '@imtbl/sdk';

const checkoutSDK = new checkout.Checkout();

export function Storefront() {
  const [saleWidget, setSale] = 
    useState<checkout.Widget<typeof checkout.WidgetType.SALE>>();
  const [widgetMounted, setWidgetMounted] = useState(false);

  // Initialise widgets, create primary sales widget
  useEffect(() => {
    (async () => {
      const widgets = await checkoutSDK.widgets({
        config: { theme: checkout.WidgetTheme.DARK },
      });
      const saleWidget = widgets.create(checkout.WidgetType.SALE, {
        config: { theme: checkout.WidgetTheme.DARK },
      });
      setSale(saleWidget);
    })();
  }, []);

  // mount primary sales widget and add event listeners
  useEffect(() => {
    if (!saleWidget || !widgetMounted) return;

    const items = [
      {
        id: 1,
        name: "Fox NFT",
        price: "$1 USDC",
        image: "https://rose-ministerial-termite-701.mypinata.cloud/ipfs/Qmd3oT99HypRHaPfiY6JWokxADR5TzR1stgonFy1rMZAUy",
        description: "Fox NFT Limited EDT",
        productId: 'vi7age4ku18qynwbk4wx90ge',
        qty: 1,
        collectionName: 'Immutable Runner Fox'
    },
    ];

    saleWidget.mount('primary-sales', {
      language: 'en',
      environmentId: 'fc05e665-2038-412a-a5eb-c5c102975364',
      collectionName: 'Immutable Runner Fox',
      items: items,
    });

    saleWidget.addListener(
      checkout.SaleEventType.SUCCESS,
      (data: checkout.SaleSuccess) => {
        console.log('success', data);
      }
    );
    saleWidget.addListener(
      checkout.SaleEventType.FAILURE,
      (data: checkout.SaleFailed) => {
        console.log('failure', data);
      }
    );
    saleWidget.addListener(
      checkout.SaleEventType.TRANSACTION_SUCCESS,
      (data: checkout.SaleTransactionSuccess) => {
        console.log('tx success', data);
      }
    );
    saleWidget.addListener(
      checkout.SaleEventType.PAYMENT_METHOD,
      (data: checkout.SalePaymentMethod) => {
        console.log('payment method selected', data);
      }
    );
    saleWidget.addListener(checkout.SaleEventType.CLOSE_WIDGET, () => {
      saleWidget.unmount();
      setWidgetMounted(false); // Reset state when the widget is closed
    });
  }, [saleWidget, widgetMounted]);

  return (
    <VStack spacing={4}>
      <Box borderRadius="md" overflow="hidden" boxShadow="md" border="1px solid" borderColor="gray.200" maxWidth="300px">
        <Image src="https://rose-ministerial-termite-701.mypinata.cloud/ipfs/Qmd3oT99HypRHaPfiY6JWokxADR5TzR1stgonFy1rMZAUy" alt="Fox NFT" />
        <Box p={4}>
          <Text color="black"fontSize="xl" fontWeight="bold">Fox NFT</Text>
          <Text fontSize="md" color="gray.600">Fox NFT Limited EDT</Text>
          <Text fontSize="lg" color="green.500">$1 USDC</Text>
          <Button mt={4} width="full" backgroundColor="black" color="white" onClick={() => setWidgetMounted(true)}>Buy Item</Button>
        </Box>
      </Box>
      <div id="primary-sales" style={{ display: widgetMounted ? 'block' : 'none' }} />
    </VStack>
  );
}