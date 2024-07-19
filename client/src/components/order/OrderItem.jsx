import { displayPrice } from "@/utils/helper.util.js";
import { Link } from "react-router-dom";

const OrderItem = ({ item }) => {
  return (
    <Link to={`/product/${item.slug}-${item.productId}`}>
      <div className="grid grid-cols-[6rem_1fr_auto] gap-2">
        <img
          src={item.image}
          alt="product"
          className="h-20 w-20 object-contain"
        />
        <div>
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        </div>
        <div>${displayPrice(item.price * item.quantity)}</div>
      </div>
    </Link>
  );
};

export default OrderItem;
