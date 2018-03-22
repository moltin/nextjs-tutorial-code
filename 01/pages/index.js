import { getProducts } from '../lib/moltin'

const Home = ({ products }) => <pre>{JSON.stringify(products, '\t', 2)}</pre>

Home.getInitialProps = async () => {
  const products = await getProducts()

  return {
    products
  }
}

export default Home
