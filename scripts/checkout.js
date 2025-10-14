import { renderOrderSummary } from './checkout/orderSummary.js'
import { renderPaymentSummary } from './checkout/paymentSummary.js'
import { updateCheckoutItems } from './utils/cartQuantity.js';
//import '../data/cart-class.js'

renderOrderSummary()
renderPaymentSummary()
updateCheckoutItems()