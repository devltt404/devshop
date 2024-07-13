import { Button } from "@/components/ui/button.jsx";
import {
  useAuthorizeOrderMutation,
  useCreateOrderMutation,
} from "@/redux/api/order.api.js";
import { setNumCartItems } from "@/redux/slices/cart.slice.js";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PageDescription, PageTitle } from "../ui/PageTitle.jsx";
import { toast } from "../ui/use-toast.js";
import StripeIcon from "../icons/StripeIcon.jsx";

const CheckoutForm = ({ paymentIntentId, setIsCheckingOut, orderData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          orderData,
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

      dispatch(setNumCartItems(0));
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
    <form onSubmit={handleSubmit} className="max-lg:order-1">
      <PageTitle className="mb-1">Checkout</PageTitle>
      <PageDescription>Your payment is powered by
        <StripeIcon className="w-14 h-14" />
         </PageDescription>

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Shipping Info</h2>
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
        <h2 className="mb-2 text-2xl font-semibold">Payment Info</h2>
        <PaymentElement />
      </div>

      <Button disabled={!stripe} className="w-full py-6">
        Checkout
      </Button>
    </form>
  );
};

export default CheckoutForm;
