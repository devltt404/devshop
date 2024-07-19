import { displayPrice } from "@/utils/helper.util.js";
import OrderItem from "../order/OrderItem.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";

const CheckoutSummary = ({ orderData }) => {
  return (
    orderData && (
      <div className="h-fit rounded-lg border border-gray-300 p-6 bg-white">
        <h2 className="mb-6 text-2xl font-semibold text-primary">
          Order Summary
        </h2>
        <div className="mb-4 flex justify-between text-lg font-semibold">
          <h3>Subtotal: </h3>
          <span>${displayPrice(orderData.price?.subtotal)}</span>
        </div>

        <div className="mb-4 flex flex-col gap-6">
          {orderData.items?.map((item) => {
            return (
              <OrderItem key={item.itemId || item.productId} item={item} />
            );
          })}
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
          <Button className="px-8" variant="secondary">
            Apply
          </Button>
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
