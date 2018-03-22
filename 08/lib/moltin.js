import { gateway as MoltinGateway } from '@moltin/sdk'

const Moltin = MoltinGateway({
  client_id: '...'
})

export const getProducts = () => Moltin.Products.With('main_image').All()

export const getProductById = id => Moltin.Products.With('main_image').Get(id)

export const addToCart = (productId, quantity) =>
  Moltin.Cart().AddProduct(productId, quantity)

export const getCartItems = id => Moltin.Cart(id).Items()

export const removeFromCart = (productId, cartId) =>
  Moltin.Cart(cartId).RemoveItem(productId)

export const checkoutCart = (cartId, customer, billing) =>
  Moltin.Cart(cartId).Checkout(customer, billing)

export const payForOrder = (orderId, token, email) =>
  Moltin.Orders.Payment(orderId, {
    gateway: 'stripe',
    method: 'purchase',
    payment: token,
    options: {
      receipt_email: email
    }
  })

export const register = async ({ email, password, ...rest }) => {
  const { data: { name, id } } = await Moltin.Customers.Create({
    email,
    password,
    type: 'customer',
    ...rest
  })

  const { token } = await login({ email, password })

  return {
    id,
    name,
    email,
    token
  }
}
