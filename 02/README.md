# Part 02

In this tutorial we will improve our Homepage to make use of the popular React [Semantic UI](react.semantic-ui.com) library and create various components for our layout.

We'll begin by installing the `semantic-ui-react` npm package via Yarn.

```bash
yarn add semantic-ui-react # npm install semantic-ui-react
```

While this package installs the necessary files to use Semantic UI components, we will next include the CSS from the Cloudflare CDN.

### Creating a layout

Right now our Homepage doesn't have any styling and we need an easy way to navigate across our store.

Inside the project root, you'll want to create a `Layout.js` file inside a new directory called `components`. We'll be following some simple React patterns for an application as small as this and combing all our UI components inside this folder.

```bash
mkdir components
touch components/Layout.js
```

Now inside `components/Layout.js`, let's import the Next.js `Head` component. This exposes a built-in component that appends elements to the `<head>` of the page.

We'll also export a default component that returns any provided `children` props and set some default `meta` for our `viewport` and page `charSet`.

Next.js will cleanup what is placed inside `<Head>` when the component is unmounted. We'll reuse the the `<Layout>` component across multiple pages so we always have the CSS available for Semantic UI.

Using ES2015 destructuring assignment we can easily return a function while grabbing the `{children}` props.

Your code should look something like the below;

```js
import Head from 'next/head'

export default ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
      />
    </Head>

    {children}
  </div>
)
```

Now we have Semantic UI fully installed our `<Layout>` component created, let's go ahead and make use of the `<Container>` component provided to us by Semantic UI. We're going to wrap our `{children}`

Below your `Head` import, we'll import our `Container` component.

```js
import { Container } from 'semantic-ui-react'
```

The `Container` component accepts multiple props and we're going to make use of the `text` which will reduce the maximum width. You can find out what this component and others accept via the [Semantic UI docs](https://react.semantic-ui.com/elements/container).

Let's go ahead and update `Layout.js` to make use of our new component.

```js
<Container text>{children}</Container>
```

### Use the Layout component on our Homepage

Now we have a `Layout` component, let's go ahead and update our `pages/index.js` page.

Begin by importing the Layout and update the `render` method to return the `pre` tag wrapped by `<Layout>`.

```js
import Layout from '../components/Layout'

export default class Home extends React.Component {
  // ...

  render() {
    const { products } = this.props

    return (
      <Layout>
        <pre>{JSON.stringify(products, '\t', 2)}</pre>
      </Layout>
    )
  }
}
```

Before we continue to improve our Homepage, let's go ahead and check our changes locally.

Start the next development server by running `yarn dev` inside your Terminal.

Now, if you visit [http://localhost:3000](http://localhost:3000) you will see our content is now inside a small width container.

### Extend Layout with a Header component

Now that we have a `Layout` component, we need the ability to navigate between pages as our store grows. Inside our newly defined `./components` directory, create a `Header.js` file.

```bash
touch components/Header.js
```

Inside `Header.js` we are going to use the Semantic UI [Menu](https://react.semantic-ui.com/collections/menu) component to add the moltin logo and store name.

We'll also import the Next.js `Link` component that is used for client-side transitions between routes.

While our Menu component will be full width, we'll want the width to match our `Layout` component. We can use the `<Container text>` component here also.

We'll use the moltin logo inside our Header, so make sure you save a copy of the SVG below to `./static/moltin-light-hex.svg`.

<a href="static/moltin-light-hex.svg">
  <img style="width:50px;" src="static/moltin-light-hex.svg" />
</a>

The `./components/Header.js` file should look something like the below;

```js
import Link from 'next/link'
import { Menu, Container, Image } from 'semantic-ui-react'

export default () => (
  <Menu inverted fixed="top" size="huge">
    <Container text>
      <Link href="/" prefetch passHref>
        <Menu.Item as="a" header>
          <Image
            size="mini"
            src="/static/moltin-light-hex.svg"
            style={{ marginRight: '1.5em' }}
          />
          NextJS Store
        </Menu.Item>
      </Link>
    </Container>
  </Menu>
)
```

In the example above we have to specify the `passHref` prop to our `<Link>` component so `<Menu.Item>` receives the href. We also added some extra margin to the Image.

To maximize performance during page transitions, we are using the `prefetch` prop on our `<Link>` component so that any data requests inside `getInitialProps` will be triggered ahead of any page transitions.

Next we need to import and display the `<Header />` component inside our Layout.

⚠️ We'll also add some padding to our layout container so it doesn't hide under the fixed header.

Your `./components/Layout.js` should now look something like the following;

```js
import Head from 'next/head'
import { Container } from 'semantic-ui-react'

import Header from './Header'

export default ({ children }) => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
      />
    </Head>

    <Header />

    <Container text style={{ paddingTop: '7em' }}>
      {children}
    </Container>
  </div>
)
```

### Update the Homepage products query

Inside `./pages/index.js` we are fetching products from the moltin API inside the `getInitialProps` method.

This lifecycle method provided by Next.js will wait until the data is resolved before the page displays and returns the data via props.

Like any online store, we need product images and because the moltin API follows JSON API spec, we will receive an `included` array of all the main images our `getProducts()` query returned..

```js
static async getInitialProps() {
  const { data, included: { main_images } } = await getProducts()

  const products = data.map(product => {
    const imageExists = product.relationships.main_image
      ? product.relationships.main_image.data.id
      : false

    return {
      ...product,
      image: imageExists
        ? main_images.find(img => img.id === hasMainImage).link.href
        : 'http://placehold.it/150x150'
    }
  })

  return {
    products
  }
}
```

The above will break what currently exists inside the `render` method but we will fix that next.

### Update the Homepage products list

Next we will create a new component that can list our products. We'll go ahead and import this component and add it inside our existing homepage `render` method, and pass along `products` as provided to us via props.

Go ahead and create the file `./components/ProductList.js` and add the following initial code.

```js
import Link from 'next/link'
import { Item } from 'semantic-ui-react'

const mapProductsToItems = products => []

export default ({ products }) => (
  <Item.Group items={mapProductsToItems(products)} />
)
```

In the code above we have imported the `Item` component from Semantic UI, created a function that returns an empty array and exported a function returns the Semantic UI `Item` component.

The `Item.Group` is a component that accepts a variety of different props and the `items` prop is the most important for us here.

If we provide an array of specific objects with the appropriate attributes, `Item.Group` will take care of iterating through our products and displaying them to the page.

We're now going to update the `mapProductsToItems` function so that it returns the correct object. By using ES2015 destructuring we can grab the necessary values to display inside our component. We will need the following;

* `id`
* `name`
* `image`
* `description`
* `meta.display_price`

```js
const mapProductsToItems = products =>
  products.map(({ id, name, image, description, meta }) => {
    const price = meta.display_price.with_tax.formatted || null

    return {
      // ...
    }
  })
```

The attributes `<Item.Group items={...} />` that we're interested in are;

* `childKey`
* `image`
* `header`
* `description`
* `meta`

The `childKey` must be a unique value, this is what React uses while displaying a list of items so it knows what to update during any invoked renders.

Our `image` value will be a component that contains an image that is a link to our product.

`header` will contain the name of our product as a link to the product page, which we'll create later.

---

TO FINISH
