# Part 01

In this tutorial we will setup our [Next.js](https://github.com/zeit/next.js) application and install the necessary dependencies to get starting building a Server Side Rendered React store from scratch with the [moltin](https://moltin.com).

⚠️ Before we get started with the code, make sure to register or login to the [moltin Dashboard](https://dashboard.moltin.com) and make note of your `client_id`.

### Setup

You'll want to create a directory for your project and change directory into your newly created project. Throughout this tutorial I have named my project `nextjs-demo-store`.

```bash
mkdir nextjs-demo-store
cd nextjs-demo-store
```

### Install dependencies

Now you're inside the folder, we need to install our dependencies. Next.js allows us to bring our own version of React and React DOM.

We will use [Yarn](https://yarnpkg.com/en/docs/install) and specify the `-E` flag to make sure we're installing the current available package version.

```bash
yarn add -E react react-dom next @moltin/sdk # or npm install -E
```

### Configure scripts

With our dependencies installed, you'll want to open your project inside your code editor and open the `package.json` file.

Inside the `package.json` we are going to add the required `scripts` to `start`, `build` and serve our application in development (`dev`).

I'd recommend adding these above the dependencies list, so they're easier to find when you install additional dependencies later.

```json
"scripts": {
  "dev": "next",
  "build": "next build",
  "start": "next start"
},
```

### Create an index page

Before we invoke the `dev` script, we need to create an index page. Right now we'll output 'hello world' to the screen. This page will later show all our products.

Next.js was built with the convention over configuration approach, so as long as we follow the Next.js conventions, we should get up and running fairly quickly.

Create a directory called `pages`, and inside that folder, create a file called `index.js`. You can use your code editor or your command line to do this.

```bash
mkdir pages
touch pages/index.js
```

Inside of `pages/index.js` we're going to output `Hello world`. You don't need to import React either, Next.js takes care of this for us.

```js
export default () => <h1>Hello world</h1>
```

### Start the development

We're now able to run our project and see `Hello world` in our browser. To do this...

```bash
yarn dev # or npm run dev
```

Next.js will greet you that your application is running at [http://localhost:3000](http://localhost:3000) by default.

### Configure the moltin SDK

Next.js uses Webpack under the hood and to enable the moltin SDK to work with Webpack, we need to add some small configuration.

To do this we can easily [customize the Next.js webpack config](https://github.com/zeit/next.js#customizing-webpack-config). Inside of your root directory, create and open a file called `next.config.js`.

```bash
touch next.config.js
```

Inside this file, you will want to place the following code;

```js
module.exports = {
  webpack: config => {
    config.node = {
      fs: 'empty'
    }

    return config
  }
}
```

If you've not used the moltin SDK before, we are told to do this inside the [usage guide](https://github.com/moltin/js-sdk#usage).

Next you'll want to create the file `moltin.js` inside of a new directory 'lib'.

```bash
mkdir lib
touch lib/moltin.js
```

Inside `lib/moltin.js` we will import the `@moltin/sdk` dependency and configure the SDK to work with our `client_id`, that we created earlier.

Your file should look something like this...

```js
import { gateway as MoltinGateway } from '@moltin/sdk'

const Moltin = MoltinGateway({
  client_id: '...'
})
```

Now that we have our `MoltinGateway` configured, the SDK silently handles authentication, so there is nothing else you need to do other than make requests to the API using the SDK.

Finally we will make sure that our API is working by fetching a list of products from the moltin API.

Inside `lib/moltin.js` we will create a function called `getProducts`. This function will return a list of all products from our store.

The function should look like the following and we'll export it, so we can import it from another file.

```js
export const getProducts = () => Moltin.Products.All()
```

### Get all products via our `getProducts` function

Now we have a function that can get all our products via the SDK, we're going to update our `pages/index.js` page to show our products as JSON.

Open `pages/index.js` and what we created previously. Next, add the following line that imports the `getProducts` function from our `lib/moltin.js` file.

```js
import { getProducts } from '../lib/moltin'
```

Now let's go ahead and make use of a lifecycle method that is provided by Next.js called `getInitialProps` and is only available to our `pages`. This method can asynchronously fetch data (using the `async` and `await` keywords) and pass it on as props.

To keep our code clean, we'll make use of a functional component, insert a `getInitialProps` method and return our products as `JSON` using the HTML `pre` tag. _Don't forget to export the `Home` component._

Below the `import` line inside `pages/index.js`, add...

```js
const Home = ({ products }) => <pre>{JSON.stringify(products, '\t', 2)}</pre>

Home.getInitialProps = async () => {
  const products = await getProducts()

  return {
    products
  }
}

export default Home
```

In the function above, we're using destructuring assignment syntax to get `products` the `props` that are passed down from the `getInitialProps` method, which is ran on the server and client.

Now if you start the Next.js dev server using `yarn dev` you will be presented with a list of products from the moltin API.

If you open the Chrome Developer Tools and head over the Network tab, if you refresh the page, you won't see a request to the moltin API because this is happening on the server. We'll go into this in more detail in Part 2.
