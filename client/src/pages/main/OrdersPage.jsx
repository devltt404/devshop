import LoadingArea from "@/components/loading/LoadingArea.jsx";
import OrderStatusBadge from "@/components/order/OrderStatusBadge.jsx";
import PageTitle from "@/components/ui/PageTitle.jsx";
import { useGetUserOrdersQuery } from "@/redux/api/order.api.js";
import { displayPrice } from "@/utils/helper.util.js";
import moment from "moment";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const { data, isLoading } = useGetUserOrdersQuery();

  const orders = useMemo(() => {
    return data?.metadata?.orders;
  });

  if (isLoading) {
    return <LoadingArea />;
  }

  return (
    orders && (
      <div className="container-area">
        <PageTitle className="mb-5">Orders</PageTitle>
        {orders.length === 0 ? (
          <p className="text-lg">You don't have any orders yet.</p>
        ) : (
          orders.map((order) => {
            return (
              <Link key={order._id} to={`/order/${order._id}`}>
                <div className="mb-4 rounded-lg border px-8 pb-6 pt-4">
                  <div className="mb-2">
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>

                  <div className="grid grid-cols-[1fr_auto] justify-between gap-x-4 gap-y-1">
                    <h2 className="truncate text-xl font-medium">
                      Order ID: #{order._id}
                    </h2>
                    <p className="text-right">
                      {order.items?.length}{" "}
                      {order.items?.length === 1 ? "Item" : "Items"}
                    </p>
                    <p>{moment(order.createdAt).format("MMMM DD, YYYY")}</p>
                    <p className="text-right text-xl font-semibold">
                      ${displayPrice(order.price?.total)}
                    </p>
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-5 [&>li]:w-16">
                    {order.items?.map((item) => (
                      <li key={item._id} className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-contain"
                        />
                        <span className="absolute -right-2 -top-2 flex aspect-square h-4 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            );
          })
        )}
      </div>
    )
  );
};

export default OrdersPage;
