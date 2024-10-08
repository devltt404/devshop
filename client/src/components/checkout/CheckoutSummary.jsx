import { displayPrice } from "@/utils/helper.util.js";
import OrderItem from "../order/OrderItem.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

const CheckoutSummary = ({ orderData }) => {
  return (
    orderData && (
      <div className="h-fit rounded-lg border border-gray-300 bg-white p-6">
        <h2 className="mb-6 text-2xl font-bold text-primary">Order Summary</h2>

        <div className="mb-4 flex flex-col gap-8">
          {orderData.items?.map((item) => {
            return <OrderItem key={item.sku} item={item} />;
          })}
        </div>

        <div className="mb-2 flex justify-between text-lg font-semibold">
          <h3>Subtotal: </h3>
          <span>${displayPrice(orderData.price?.subtotal)}</span>
        </div>
        <div className="mb-4 flex justify-between text-lg font-semibold">
          <h3>Shipping: </h3>
          <span>
            {orderData.price?.shipping === 0
              ? "Free"
              : "$" + displayPrice(orderData.price?.shipping)}
          </span>
        </div>

        <div className="mb-4 flex border-y border-y-gray-300 py-6">
          <Input placeholder="Enter coupon code" className="mr-4" />
          <Button className="px-8">Apply</Button>
        </div>
        <div>
          <div className="flex justify-between text-2xl font-bold">
            <h3>Total: </h3>
            <span>${displayPrice(orderData.price?.total)}</span>
          </div>
        </div>
      </div>
    )
  );
};

export default CheckoutSummary;
