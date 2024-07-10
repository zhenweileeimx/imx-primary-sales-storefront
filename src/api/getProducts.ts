import config, { applicationEnvironment } from "../config/config";
import { Product, ProductsResult, ProductWithMetadata } from "../types/product";
import { blockchainDataClient } from "../immutable/blockchainData";

export async function getProducts(): Promise<ProductWithMetadata[]> {
  const products: ProductsResult = await (
    await fetch(`${config[applicationEnvironment].primarySaleBackendUrl}/products`, {
      method: 'GET',
      headers: {
        'Authorization': config[applicationEnvironment].primarySaleApiKey,
      }
    })
  ).json();
  console.log("Primary sale products: ", products);

  const metadataCalls = products.productData.map((product: Product) =>
    blockchainDataClient.getMetadata({
      chainName: 'imtbl-zkevm-testnet',
      contractAddress: product.contract_address,
      metadataId: product.metadata_id,
    })
  );

  const metadataResults = await Promise.all(metadataCalls);

  // add metadata to product
  const productsWithMetadata = products.productData.map((product: Product) => {
    const metadata = metadataResults.find((metadata) => metadata.result.id === product.metadata_id);
    return {
      ...product,
      metadata: metadata?.result
    }
  });
  console.log("Primary sale products with metadata: ", { productData: productsWithMetadata });
  return productsWithMetadata as ProductWithMetadata[];
}