import Link from 'next/link'
import { Button, Segment, Divider } from 'semantic-ui-react'

export default ({ display_price: { with_tax: { formatted } } }) => (
  <React.Fragment>
    <Divider />

    <Segment clearing size="large">
      <strong>Sub total:</strong> {formatted}
      <Link href="/checkout" prefetch passHref>
        <Button as="a" color="black" floated="right">
          Check out
        </Button>
      </Link>
    </Segment>
  </React.Fragment>
)
