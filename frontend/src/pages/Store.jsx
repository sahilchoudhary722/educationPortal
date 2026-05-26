import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import ProductCard from "../components/ProductCard";

function Store() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div>
      <h1 className="page-title">Store</h1>

      <div className="grid-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Store;