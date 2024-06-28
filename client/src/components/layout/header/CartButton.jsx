import { useGetSimpleCartQuery } from "@/redux/api/cart.api.js";
import { authSelector } from "@/redux/slices/auth.slice.js";
import { cartSelector, setNumCartItems } from "@/redux/slices/cart.slice.js";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CartButton = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);

  const { data } = useGetSimpleCartQuery();

  const { numCartItems } = useSelector(cartSelector);
  useEffect(() => {
    if (data) {
      dispatch(setNumCartItems(data.metadata?.cart?.numCartItems));
    }
  }, [data, user]);

  return (
    <Link
      to="/cart"
      className="flex items-center rounded-md px-4 py-3 transition hover:bg-muted"
    >
      <button className="relative">
        <ShoppingBag className="stroke-[1.5px]" />
        {numCartItems > 0 && (
          <span className="absolute -right-1 -top-1 h-4 w-4 scale-90 rounded-full bg-red-600 text-center font-mono text-sm leading-4 text-white">
            {numCartItems}
          </span>
        )}
      </button>
    </Link>
  );
};

export default CartButton;