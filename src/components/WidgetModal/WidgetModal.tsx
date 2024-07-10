import { Link, Modal, ModalContent, Text, theme, useToast } from '@chakra-ui/react'
import { BridgeEventType, ConnectEventType, ConnectionSuccess, OnRampEventType, OrchestrationEventType, ProviderEventType, ProviderUpdated, RequestBridgeEvent, RequestOnrampEvent, RequestSwapEvent, SaleEventType, SaleFailed, SalePaymentMethod, SaleSuccess, SaleTransactionSuccess, SwapEventType, WalletEventType, WidgetParameters, WidgetType } from '@imtbl/sdk/checkout'
import { CheckoutContext } from '../../contexts/CheckoutContext';
import { useContext, useEffect } from 'react';
import { EIP1193Context, EIP1193Provider } from '../../contexts/EIP1193Context';
import config, { applicationEnvironment } from '../../config/config';

interface WidgetModal {
  widgetType: WidgetType;
  params?: WidgetParameters[WidgetType];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function WidgetModal({
  widgetType,
  params,
  isOpen,
  onClose
}: WidgetModal) {
  const {setProvider} = useContext(EIP1193Context);
  const {widgets: {connect, wallet, bridge, swap, onramp, sale}} = useContext(CheckoutContext);
  const toast = useToast();

  useEffect(() => {
    if(!connect || !wallet || !bridge || !swap || !onramp || !isOpen) return;

    connect.addListener(ConnectEventType.CLOSE_WIDGET, () => {
      onClose();
      connect.unmount();
    })
    wallet.addListener(WalletEventType.CLOSE_WIDGET, () => {
      onClose();
      wallet.unmount();
    })
    swap.addListener(SwapEventType.CLOSE_WIDGET, () => {
      onClose();
      swap.unmount();
    })
    bridge.addListener(BridgeEventType.CLOSE_WIDGET, () => {
      onClose();
      bridge.unmount();
    })
    onramp.addListener(OnRampEventType.CLOSE_WIDGET, () => {
      onClose();
      onramp.unmount();
    })
    sale?.addListener(SaleEventType.CLOSE_WIDGET, () => {
      onClose();
      sale.unmount();
    })

    switch(widgetType) {
      case WidgetType.CONNECT: {
        connect.addListener(ConnectEventType.SUCCESS, (data: ConnectionSuccess) => {
          onClose();
          connect.unmount();
          setProvider(data.provider.provider as EIP1193Provider);
        })
        connect.addListener(ProviderEventType.PROVIDER_UPDATED, (data: ProviderUpdated) => {
          setProvider(data.provider.provider as EIP1193Provider);
        })
        // Hack to get to render
        const render = Promise.resolve();
        render.then(() => connect.mount('widget-target'))
        break;
      }
      case WidgetType.WALLET: {
        wallet.addListener(WalletEventType.DISCONNECT_WALLET, () => {
          wallet.unmount();
          // logout();
        })
        wallet.addListener(OrchestrationEventType.REQUEST_BRIDGE, (data: RequestBridgeEvent) => {
          wallet.unmount();
          bridge.mount('widget-target', {...data})
        })
        wallet.addListener(OrchestrationEventType.REQUEST_SWAP, (data: RequestSwapEvent) => {
          wallet.unmount();
          swap.mount('widget-target', {...data})
        })
        wallet.addListener(OrchestrationEventType.REQUEST_ONRAMP, (data: RequestOnrampEvent) => {
          wallet.unmount();
          onramp.mount('widget-target', {...data})
        });

        // Hack to get to render
        const render = Promise.resolve();
        render.then(() => wallet.mount('widget-target'))
        break;
      }
      case WidgetType.SALE: {
        sale?.addListener(SaleEventType.TRANSACTION_SUCCESS, (data: SaleTransactionSuccess) => {
          console.log(data);
          toast({
            position: 'bottom-right',
            title: <Text>Success! <Link color={theme.colors.pink[500]} target='_blank' href={`${config[applicationEnvironment].explorerUrl}/tx/${data.transactions[0].hash}`}>See transaction</Link></Text>,
            duration: 8000,
            isClosable: true,
            status: 'success'
          })
        });
        sale?.addListener(SaleEventType.SUCCESS, (data: SaleSuccess) => {
          console.log(data);
        });
        sale?.addListener(SaleEventType.REJECTED, (data) => {
          console.log(data);
          toast({
            position: 'bottom-right',
            title: <Text>Purchase rejected</Text>,
            duration: 4000,
            isClosable: true,
            status: 'error'
          })
        });
        sale?.addListener(SaleEventType.PAYMENT_METHOD, (data: SalePaymentMethod) => {
          console.log(data);
        });
        sale?.addListener(SaleEventType.FAILURE, (data: SaleFailed) => {
          console.log(data)
          toast({
            position: 'bottom-right',
            title: <Text>Purchase failed.</Text>,
            duration: 4000,
            isClosable: true,
            status: 'error'
          })
        });

        sale?.addListener(OrchestrationEventType.REQUEST_BRIDGE, (data: RequestBridgeEvent) => {
          sale.unmount();
          bridge.mount('widget-target', {...data})
        })
        sale?.addListener(OrchestrationEventType.REQUEST_SWAP, (data: RequestSwapEvent) => {
          sale.unmount();
          swap.mount('widget-target', {...data})
        })
        sale?.addListener(OrchestrationEventType.REQUEST_ONRAMP, (data: RequestOnrampEvent) => {
          sale.unmount();
          onramp.mount('widget-target', {...data})
        });

        console.log('opening sale widget with params...', params)
        // Hack to get to render
        const render = Promise.resolve();
        render.then(() => sale?.mount('widget-target', {...params}))
      }
    }
  }, [
    isOpen, 
    widgetType, 
    connect, 
    wallet, 
    bridge, 
    swap, 
    onramp,
    sale, 
    onClose, 
    setProvider,
    params,
    toast]
  );

  return (
    <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose} isCentered>
      <ModalContent id="widget-target" h="650px" w="430px" bgColor={theme.colors.black}>
        <div id="widget-target" />
      </ModalContent>
    </Modal>
  )
}

export default WidgetModal