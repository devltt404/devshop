import CheckoutForm from "@/components/checkout/CheckoutForm.jsx";
import CheckoutSummary from "@/components/checkout/CheckoutSummary.jsx";
import LoadingOverlay from "@/components/loading/LoadingOverlay.jsx";
import LoadingScreen from "@/components/loading/LoadingScreen.jsx";
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

  const [orderData, setOrderData] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    createPaymentIntent()
      .unwrap()
      .then((data) => {
        setClientSecret(data.metadata?.clientSecret);
        setPaymentIntentId(data.metadata?.paymentIntentId);
        setOrderData(data.metadata?.orderData);
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

  if (!clientSecret || !orderData || !paymentIntentId) {
    return <LoadingScreen />;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <LoadingOverlay isLoading={isCheckingOut}>
        <div className="container-area grid grid-cols-[60%_40%] gap-x-12 gap-y-12 py-8 max-lg:grid-cols-1 ">
          <CheckoutForm
            paymentIntentId={paymentIntentId}
            setIsCheckingOut={setIsCheckingOut}
            orderData={orderData}
          />
          <CheckoutSummary orderData={orderData} />
        </div>
      </LoadingOverlay>
    </Elements>
  );
};

export default CheckoutPage;
