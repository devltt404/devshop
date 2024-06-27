import CheckoutForm from "@/components/checkout/CheckoutForm.jsx";
import { useGetDetailedCartQuery } from "@/redux/api/cart.api.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckoutPage = () => {
  const cart = useGetDetailedCartQuery();

  const options = {
    mode: "payment",
    amount: 1000,
    currency: "usd",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="py-container container">
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default CheckoutPage;
