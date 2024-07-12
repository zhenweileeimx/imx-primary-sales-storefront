import { HStack, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PrimarySale } from "../PrimarySale/PrimarySale";
import { getProducts } from "../../api/getProducts";
import { ProductWithMetadata } from "../../types/product";

export function Storefront() {
  // Local state
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const [products, setProducts] = useState<ProductWithMetadata[]>([]);

  useEffect(() => {
    const getStorefrontProducts = async () => {
      setLoading(true);
      try{
        const storefrontProducts = await getProducts();
        setProducts(storefrontProducts);
      } catch(err) {
        console.log(err);
        toast({
          status: 'error',
          title: 'Could not get products for sale',
          duration: 4000,
          position: 'bottom-right'
        })
      } finally {
        setLoading(false)
      }
    }
    getStorefrontProducts();
  }, [toast])

  return (
    <HStack justifyContent={'center'} gap={4} flexWrap={'wrap'}>
      {loading && <Spinner />}
      {!loading && products.length > 0 && products.map((product) => <PrimarySale key={product.id} product={product} />)}
    </HStack>
  );
}