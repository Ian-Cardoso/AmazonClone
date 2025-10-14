import { products, getProduct } from '../data/products.js'

function renderOrders() {
  const ordersGrid = document.querySelector('.orders-grid')
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  let ordersHTML = ''
  orders.forEach(order => {
    let orderItemsHTML = ''
    order.cart.forEach(cartItem => {
      const product = getProduct(cartItem.productId)
      orderItemsHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">${product.name}</div>
          <div class="product-delivery-date">Arriving soon</div>
          <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `
    })

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${new Date(order.date).toLocaleDateString()}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>See details</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${Math.random().toString(36).substring(2, 15)}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${orderItemsHTML}
        </div>
      </div>
    `
  })

  ordersGrid.innerHTML = ordersHTML
}

function updateCartQuantity() {
  const cart = JSON.parse(localStorage.getItem('cart')) || []
  let cartQuantity = 0
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  })
  const cartQuantityElement = document.querySelector('.cart-quantity')
  if (cartQuantityElement) {
    cartQuantityElement.innerText = cartQuantity
  }
}

renderOrders()
updateCartQuantity()

