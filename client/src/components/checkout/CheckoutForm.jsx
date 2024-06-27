import { Button } from "@/components/ui/button.jsx";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
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
