import { Button } from "@/components/ui/button.jsx";
import {
  useAuthorizeOrderMutation,
  useCreateOrderMutation,
} from "@/redux/api/order.api.js";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast.js";

const CheckoutForm = ({ paymentIntentId, setIsCheckingOut }) => {
  const navigate = useNavigate();

  const [createOrder] = useCreateOrderMutation();
  const [authorizeOrder] = useAuthorizeOrderMutation();

  const stripe = useStripe();
  const elements = useElements();

  const [orderIdState, setOrderIdState] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsCheckingOut(true);

    // Validate the form
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setIsCheckingOut(false);
      return;
    }

    const addressElementValue = (
      await elements.getElement(AddressElement).getValue()
    ).value;

    // Create order
    let orderId = orderIdState;
    if (!orderId) {
      try {
        const result = await createOrder({
          customerInfo: {
            name: addressElementValue.name,
            phone: addressElementValue.phone,
          },
          shippingAddress: addressElementValue.address,
          paymentIntentId,
        }).unwrap();

        orderId = result.metadata?.order?._id;
        setOrderIdState(result.metadata?.order?._id);
      } catch (error) {
        setIsCheckingOut(false);
        return toast({
          title: "Create order failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (paymentError) {
      setIsCheckingOut(false);
      return toast({
        title: "Payment failed",
        description: paymentError.message,
        variant: "destructive",
      });
    }
    try {
      await authorizeOrder({
        orderId,
        paymentId: paymentIntent.id,
      }).unwrap();

      navigate("/order/" + orderId);
    } catch (error) {
      setIsCheckingOut(false);
      return toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsCheckingOut(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-2 text-3xl font-semibold">Checkout</h1>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-medium">Shipping Info</h2>
        <AddressElement
          options={{
            mode: "shipping",
            defaultValues: {
              address: {
                state: "CA",
                country: "US",
              },
            },
            fields: {
              phone: "always",
            },
          }}
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-medium">Payment Info</h2>
        <PaymentElement />
      </div>

      <Button disabled={!stripe} className="w-full py-6">
        Checkout
      </Button>
    </form>
  );
};

export default CheckoutForm;
