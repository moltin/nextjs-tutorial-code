import { gateway as MoltinGateway } from '@moltin/sdk'

const Moltin = MoltinGateway({
  client_id: '...'
})

export const getProducts = () => Moltin.Products.All()
