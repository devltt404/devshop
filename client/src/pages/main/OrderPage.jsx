import VisaIcon from "@/components/icons/VisaIcon.jsx";
import LoadingScreen from "@/components/loading/LoadingScreen.jsx";
import OrderItem from "@/components/order/OrderItem.jsx";
import OrderStatusBadge from "@/components/order/OrderStatusBadge.jsx";
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
import { useGetOrderDetailQuery } from "@/redux/api/order.api.js";
import { displayPrice } from "@/utils/helper.util.js";
import { Separator } from "@radix-ui/react-dropdown-menu";
import moment from "moment";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { LazyNotFound } from "../index.js";

const OrderPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailQuery(id);

  const order = useMemo(() => {
    return data?.metadata?.order;
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!order) {
    return <LazyNotFound />;
  }

  return (
    <div className="container-area">
      <div className="mb-4">
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <PageTitle className="mb-2">Order #{order._id}</PageTitle>

      <PageDescription>
        Ordered on {moment(order.createdAt).format("MM/DD/YYYY - hh:mm A")}
      </PageDescription>

      <div className="mb-6 mt-4 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Customer Info</h2>
          <p>
            <span className="text-gray-500">Name: </span>
            {order.customerInfo?.name}
          </p>
          {order.customerInfo?.phone && (
            <p>
              <span className="text-gray-500">Phone: </span>
              {order.customerInfo?.phone}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          <p>
            <span className="text-gray-500">Address: </span>
            {`${order.shippingAddress?.line1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state}, ${order.shippingAddress?.country}`}
          </p>
          <p>
            <span className="text-gray-500">Zip: </span>
            {order.shippingAddress?.postal_code}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <p className="flex items-center gap-2">
            <VisaIcon />
            Visa ending in {order.paymentMethod?.last4}
          </p>
        </div>
      </div>

      <h2 className="mb-5 text-xl font-semibold">Order Items</h2>

      <div className="mb-4 flex flex-col gap-4">
        {order.items?.map((item) => (
          <OrderItem key={item.itemId || item.productId} item={item} />
        ))}
      </div>

      <Separator className="my-6 h-[1px] bg-gray-200" />

      <div className="grid grid-cols-[1fr,10rem] justify-items-end gap-y-1">
        <p className="">Subtotal</p>
        <p className="">${displayPrice(order.price?.subtotal)}</p>
        <p className="">Shipping</p>
        <p className="">${displayPrice(order.price?.shipping)}</p>
        <p className="text-xl font-bold">Total</p>
        <p className="text-xl font-bold">${displayPrice(order.price?.total)}</p>
      </div>
    </div>
  );
};

export default OrderPage;
