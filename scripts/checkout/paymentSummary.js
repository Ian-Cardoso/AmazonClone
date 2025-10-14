import { cart } from '../../data/cart.js'
import { getProduct } from '../../data/products.js'
import { getDeliveryOption } from '../../data/deliveryOption.js'
import { formatCurrency } from '../utils/money.js'

export function renderPaymentSummary(){
    let productPriceCents = 0
    let shippingPriceCents = 0

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId)
       productPriceCents += product.priceCents * cartItem.quantity

      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId)
      shippingPriceCents += deliveryOption.priceCents
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents
    const taxCents = totalBeforeTaxCents * 0.10
    const totalCents = taxCents + totalBeforeTaxCents

    console.log(totalCents);

    const paymentSummaryHTML = `
    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
    `

    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML

    const placeOrderButton = document.querySelector('.place-order-button')
    if (placeOrderButton) {
      placeOrderButton.addEventListener('click', () => {
        // Salva o pedido e redireciona
        saveOrder()
        window.location.href = 'orders.html'
      })
    }

    // Função para salvar o pedido
    function saveOrder() {
      // Recupera pedidos anteriores
      const previousOrders = JSON.parse(localStorage.getItem('orders')) || []
      // Adiciona o pedido atual
      previousOrders.push({
        date: new Date().toISOString(),
        cart: JSON.parse(JSON.stringify(cart))
      })
      localStorage.setItem('orders', JSON.stringify(previousOrders))
      // Limpa o carrinho
      localStorage.removeItem('cart')
    }
}

