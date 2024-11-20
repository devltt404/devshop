import shopConfig from "@/configs/shop.config.js";
import { displayPrice } from "@/utils/helper.util.js";
import { Link } from "react-router-dom";
import { Button } from "../ui/button.jsx";

const CartSummary = ({ subtotal }) => {
  return (
    <div className="h-fit rounded-lg bg-white px-8 py-8 shadow-block">
      <h1 className="text-2xl font-bold text-primary">Cart Summary</h1>
      <div className="flex justify-between py-7 text-lg font-semibold">
        <h2>Subtotal</h2>
        <p>${displayPrice(subtotal)}</p>
      </div>
      <div className="flex justify-between border-y py-7 font-semibold">
        <div>
          <h2 className="mb-1">Shipping</h2>
          <p className="text-sm font-normal">
            Free shipping for Order $
            {displayPrice(shopConfig.freeShipThreshold)}+
          </p>
        </div>
        <p>
          {subtotal >= shopConfig.freeShipThreshold
            ? "Free"
            : `$${displayPrice(shopConfig.shippingFee)}`}
        </p>
      </div>
      <div className="my-6 flex justify-between text-2xl font-bold">
        <h2>Total</h2>
        <p>
          $
          {displayPrice(
            subtotal >= shopConfig.freeShipThreshold
              ? `${subtotal}`
              : `${subtotal + shopConfig.shippingFee}`,
          )}
        </p>
      </div>
      <div className="flex">
        <Button size="lg" className="w-full font-bold" asChild>
          <Link to="/checkout">Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
