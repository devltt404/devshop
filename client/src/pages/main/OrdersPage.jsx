import LoadingScreen from "@/components/loading/LoadingScreen.jsx";
import OrderStatusBadge from "@/components/order/OrderStatusBadge.jsx";
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
import { useGetUserOrdersQuery } from "@/redux/api/order.api.js";
import { displayPrice } from "@/utils/helper.util.js";
import moment from "moment";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const OrdersPage = () => {
  const { data, isLoading } = useGetUserOrdersQuery();

  const orders = useMemo(() => {
    return data?.metadata?.orders;
  }, [data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container-area">
      <PageTitle>Orders</PageTitle>

      {orders && orders.length === 0 ? (
        <PageDescription>You don't have any orders yet.</PageDescription>
      ) : (
        <>
          <PageDescription className="mb-5">
            You have <span className="font-semibold">{orders?.length}</span>{" "}
            {orders?.length > 1 ? "orders" : "order"}.
          </PageDescription>

          {orders.map((order) => (
            <Link key={order._id} to={`/order/${order._id}`}>
              <div className="mb-4 rounded-lg border px-8 pb-6 pt-4">
                <div className="mb-2">
                  <OrderStatusBadge status={order.orderStatus} />
                </div>

                <div className="grid grid-cols-[1fr_auto] justify-between gap-x-4 gap-y-1">
                  <h2 className="truncate text-xl font-semibold">
                    Order ID:{" "}
                    <span className="text-secondary">#{order._id}</span>
                  </h2>
                  <p className="text-right">
                    {order.items?.length}{" "}
                    {order.items?.length === 1 ? "Item" : "Items"}
                  </p>
                  <p>{moment(order.createdAt).format("MMMM DD, YYYY")}</p>
                  <p className="text-right text-xl font-bold">
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
                      <span className="absolute -right-2 -top-2 flex aspect-square h-4 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
