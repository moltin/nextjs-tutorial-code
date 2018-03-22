import Link from 'next/link'
import { Item, Button, Loader, Message } from 'semantic-ui-react'

export default ({ items, removeFromCart, loading }) => {
  if (loading) return <Loader active inline="centered" />

  if (items.length === 0)
    return (
      <Message warning>
        <Message.Header>Your cart is empty</Message.Header>
        <p>
          You'll need to add some items to the cart before you can checkout.
        </p>
      </Message>
    )

  const mapCartItemsToItems = items =>
    items.map(({ id, product_id, name, quantity, meta }) => {
      const price = meta.display_price.with_tax.unit.formatted || ''

      return {
        childKey: id,
        header: (
          <Link href={`/product?id=${product_id}`} passHref>
            <Item.Header as="a">{name}</Item.Header>
          </Link>
        ),
        meta: `${quantity}x ${price}`,
        extra: (
          <Button
            basic
            icon="remove"
            floated="right"
            onClick={() => removeFromCart(id)}
          />
        )
      }
    })

  return <Item.Group divided items={mapCartItemsToItems(items)} />
}
