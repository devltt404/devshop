import shopConfig from "@/configs/shop.config.js";
import { Button } from "../ui/button.jsx";

const CartSummary = ({ subtotal }) => {
  return (
    <div className="h-fit w-[26rem] rounded-lg bg-black px-8 py-8 text-white max-xl:w-[22rem] max-lg:w-full">
      <h1 className="text-2xl font-medium">Cart Summary</h1>
      <div className="flex justify-between border-b border-b-gray-500 py-7 text-lg font-medium">
        <h2 className="text-gray-200">Subtotal</h2>
        <p>${subtotal.toFixed(2)}</p>
      </div>
      <div className="flex justify-between border-b border-b-gray-500 py-7 font-medium">
        <div>
          <h2 className="mb-1 text-gray-200">Shipping</h2>
          <p className="text-sm font-normal text-gray-200">
            Free shipping for Order ${shopConfig.freeShipThreshold}+
          </p>
        </div>
        <p>
          {subtotal >= shopConfig.freeShipThreshold
            ? "Free"
            : `$${shopConfig.shippingFee}`}
        </p>
      </div>
      <div className="my-6 flex justify-between text-xl font-semibold">
        <h2>Total</h2>
        <p>
          {subtotal >= shopConfig.freeShipThreshold
            ? `$${subtotal.toFixed(2)}`
            : `$${(subtotal + shopConfig.shippingFee).toFixed(2)}`}
        </p>
      </div>
      <div className="flex">
        <Button variant="secondary" size="lg" className="w-full font-semibold">
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
