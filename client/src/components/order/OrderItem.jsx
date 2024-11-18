import { displayPrice } from "@/utils/helper.util.js";
import { Link } from "react-router-dom";

const OrderItem = ({ item }) => {
  return (
    <Link to={`/product/${item.slug}-${item.product}`}>
      <div className="grid grid-cols-[4.5rem_1fr] gap-4">
        <img
          src={item.image}
          alt={`${item.name} thumbnail`}
          className="mt-2 aspect-square w-full object-contain"
        />
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          </div>
          <p className="text-lg font-semibold">
            ${displayPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default OrderItem;
