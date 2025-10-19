import { cart } from '../../data/cart.js'

document.addEventListener('DOMContentLoaded', () => {
  const trackingData = JSON.parse(localStorage.getItem('tracking'))
  if (!trackingData) return

  const orderDateIso = trackingData.orderDate || trackingData.deliveryDate
  const deliveryDateIso = trackingData.deliveryDate

  document.querySelector('.delivery-date').innerText =
    `Arriving on ${new Date(deliveryDateIso).toLocaleDateString()}`

  document.querySelectorAll('.product-info')[0].innerText =
    trackingData.productName

  document.querySelectorAll('.product-info')[1].innerText =
    `Quantity: ${trackingData.productQuantity}`

  document.querySelector('.product-image').src =
    trackingData.productImage

  const cartQuantityElement = document.querySelector('.cart-quantity')
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = getCartQuantity()
  }

   function getCartQuantity() {
    let cartQuantity = 0
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity
    })
    return `${cartQuantity}`
  }

  const orderDate = new Date(orderDateIso)
  const deliveryDate = new Date(deliveryDateIso)
  const now = Date.now()
  const elapsedMs = now - orderDate.getTime()
  const totalMs = deliveryDate.getTime() - orderDate.getTime()
  const totalDays = Math.max(1, Math.round(totalMs / (24 * 60 * 60 * 1000)))

  function percentFor(totalDays, elapsedMs, orderDate, deliveryDate) {
    if (Date.now() >= deliveryDate.getTime()) return 100

    // 7 dias de entrega
    if (totalDays >= 7) {
      const day = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1
      if (day <= 1) return 10
      if (day === 2) return 25
      if (day >= 3 && day <= 5) return 50
      if (day === 6) return 75
      return 100
    }

    // 3 dias de entrega
    if (totalDays >= 3) {
      const day = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1
      if (day <= 1) return 10
      if (day === 2) return 50
      return 100
    }

    // 1 dia de entrega (calculado em horas)
    if (totalDays === 1) {
      const hours = elapsedMs / (60 * 60 * 1000)
      if (hours < 12) return 10
      if (hours >= 12 && hours < 24) return 50
      return 100
    }

    // fallback: proporção direta garante no mínimo 10%
    const ratio = Math.max(0, Math.min(1, elapsedMs / totalMs))
    return Math.max(10, Math.round(ratio * 100))
  }

  const percent = percentFor(totalDays, elapsedMs, orderDate, deliveryDate)

  // Barra de progresso
  const progressBar = document.querySelector('.progress-bar')
  if (progressBar) {
    progressBar.style.width = `${percent}%`
  }

  // Atualiza os rótulos (preparing / shipped / delivered)
  const labels = document.querySelectorAll('.progress-label')
  labels.forEach(l => l.classList.remove('current-status'))
  if (percent >= 100) {
    if (labels[2]) labels[2].classList.add('current-status') // Delivered
  } else if (percent >= 25) {
    if (labels[1]) labels[1].classList.add('current-status') // Shipped
  } else {
    if (labels[0]) labels[0].classList.add('current-status') // Preparing
  }
})