const products = [
  {
      id: 1,
      title: "Fox NFT",
      price: "$1 USDC",
      image: "https://rose-ministerial-termite-701.mypinata.cloud/ipfs/Qmd3oT99HypRHaPfiY6JWokxADR5TzR1stgonFy1rMZAUy",
      description: "Fox NFT Limited EDT",
      productId: 'vi7age4ku18qynwbk4wx90ge',
      qty: 1,
      collectionName: 'Immutable Runner Fox'
  },
  {
    id: 2,
    title: "Blue Fox(Special) ",
    price: "$0",
    image: "https://rose-ministerial-termite-701.mypinata.cloud/ipfs/QmNZeG8wkW3mFw4PrqEj34NPA88impcvemYjhAkJAM4YcK",
    description: "Fox NFT Limited EDT",
    productId: 'jtwrclpj0v1zab865ne893hb',
    qty: 1,
    collectionName: 'Immutable Runner Fox'
},

];

let saleWidget;

async function initializeCheckout() {
  console.log('Initializing checkout');
  const checkout = new ImmutableCheckout.Checkout();
  const widgets = await checkout.widgets({
      config: { theme: ImmutableCheckout.WidgetTheme.DARK },
  });
  const connect = widgets.create(ImmutableCheckout.WidgetType.CONNECT);
  const wallet = widgets.create(ImmutableCheckout.WidgetType.WALLET);
 



  saleWidget = widgets.create(ImmutableCheckout.WidgetType.SALE);
  saleWidget.addListener(ImmutableCheckout.SaleEventType.PAYMENT_METHOD, (data) => {
      console.log('payment method selected', data);
  });
  console.log('Checkout initialized');
}

function displayProducts() {
  const productList = document.getElementById('product-list');
  products.forEach(product => {
      const productCard = `
          <div class="col-md-3">
              <div class="card product-card mb-4" data-id="${product.id}">
                  <img src="${product.image}" class="card-img-top" alt="${product.title}">
                  <div class="card-body">
                      <h5 class="card-title">${product.title}</h5>
                      <p class="card-text">${product.price}</p>
                  </div>
              </div>
          </div>
      `;
      productList.innerHTML += productCard;
  });

  document.querySelectorAll('.product-card').forEach(item => {
      item.addEventListener('click', event => {
          const productId = item.getAttribute('data-id');
          showProductModal(productId);
      });
  });
}

function showProductModal(productId) {
  console.log('Displaying product modal for productId:', productId);
  const product = products.find(p => p.id == productId);
  document.getElementById('productModalTitle').innerText = product.title;
  document.getElementById('productModalPrice').innerText = product.price;
  document.getElementById('productModalImage').src = product.image;
  document.getElementById('productModalDescription').innerText = product.description;

  // Re-bind the Buy Now button's click event
  const buyNowButton = document.getElementById('buy-now-button');
  buyNowButton.onclick = () => {
      console.log('Buy Now button clicked for productId:', productId);
      showSaleWidget(product);
  };

  var myModal = new bootstrap.Modal(document.getElementById('productModal'));
  myModal.show();
}

function showSaleWidget(product) {
  console.log('Showing sale widget for product:', product);
  
  const primarySalesDiv = document.getElementById('primary-sales');
  primarySalesDiv.classList.remove('d-none');

  const items = [
      {
          productId: product.productId,
          qty: product.qty,
          name: product.title,
          image: product.image,
          description: product.description,
      },
  ];

  saleWidget.mount('primary-sales', {
      language: 'en',
      environmentId: 'fc05e665-2038-412a-a5eb-c5c102975364',
      collectionName: product.collectionName,
      items: items,
      excludePaymentTypes: [
          ImmutableCheckout.SalePaymentTypes.DEBIT,
          ImmutableCheckout.SalePaymentTypes.CREDIT,
      ],
  }).then(() => {
      console.log('Sale widget mounted successfully');
  }).catch(err => {
      console.error('Error mounting sale widget:', err);
  });
}

// Initialize checkout and display products
document.addEventListener('DOMContentLoaded', () => {
  initializeCheckout();
  displayProducts();
});