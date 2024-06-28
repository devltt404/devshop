import CheckoutForm from "@/components/checkout/CheckoutForm.jsx";
import LoadingArea from "@/components/loading/LoadingArea.jsx";
import LoadingOverlay from "@/components/loading/LoadingOverlay.jsx";
import { toast } from "@/components/ui/use-toast.js";
import { useCreatePaymentIntentMutation } from "@/redux/api/payment.api.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();

  const [cart, setCart] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    createPaymentIntent()
      .unwrap()
      .then((data) => {
        setClientSecret(data.metadata?.clientSecret);
        setPaymentIntentId(data.metadata?.paymentIntentId);
        setCart(data.metadata?.cart);
      })
      .catch((error) => {
        navigate("/cart");
        toast({
          title: "Checkout Failed",
          description: error.message,
          variant: "destructive",
        });
      });
  }, []);

  const options = {
    clientSecret,
    appearance: {
      variables: {
        colorPrimary: "#000000",
      },
    },
  };

  if (!clientSecret) {
    return <LoadingArea />;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <LoadingOverlay isLoading={isCheckingOut}>
        <div className="py-container container">
          <CheckoutForm paymentIntentId={paymentIntentId} setIsCheckingOut={setIsCheckingOut} />
        </div>
      </LoadingOverlay>
    </Elements>
  );
};

export default CheckoutPage;
