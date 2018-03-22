import Link from 'next/link'
import { Item } from 'semantic-ui-react'

const mapProductsToItems = products =>
  products.map(({ id, name, image, description, meta }) => {
    const price = meta.display_price.with_tax.formatted || null

    return {
      childKey: id,
      image: (
        <Link href={`/product?id=${id}`} passHref>
          <Item.Image size="small" src={image} as="a" />
        </Link>
      ),
      header: (
        <Link href={`/product?id=${id}`} prefetch passHref>
          <Item.Header as="a">{name}</Item.Header>
        </Link>
      ),
      description,
      meta: price
    }
  })

export default ({ products }) => (
  <Item.Group items={mapProductsToItems(products)} />
)
