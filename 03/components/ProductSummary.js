import { Item, Label } from 'semantic-ui-react'

export default ({ image, name, meta, sku }) => (
  <Item.Group>
    <Item>
      <Item.Image size="medium" src={image} />

      <Item.Content>
        <Item.Header>{name}</Item.Header>
        <Item.Description>
          <p>{meta.display_price.with_tax.formatted}</p>

          <Label>SKU: {sku}</Label>
        </Item.Description>
      </Item.Content>
    </Item>
  </Item.Group>
)
