import { CheckIcon } from "lucide-react";

const EmailForm = () => {
  return (
    <div className="container rounded-xl bg-gradient-to-t from-primary to-primary/80 py-24 text-white">
      <h2 className="text-center text-3xl font-bold">
        WANT TO GET LATEST UPDATES?
      </h2>

      <div className="my-10 flex flex-col items-center gap-2">
        <p className="text-white">
          Subscribe to our newsletter to get notified about:
        </p>

        <div>
          <span className="mr-8 inline-flex items-center gap-2 font-medium">
            <CheckIcon className="h-4 w-4" />
            <p>Product releases</p>
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <CheckIcon className="h-4 w-4" />
            <p>Discounts</p>
          </span>
        </div>
      </div>

      <form className="mt-6 flex justify-center">
        <div className="flex w-full max-w-md rounded-md border border-white shadow-outer">
          <input
            type="email"
            className="flex-1 bg-transparent px-4 outline-none text-white placeholder:text-white/50"
            placeholder="Your email address"
          />
          <button className="bg-white px-4 py-3 font-semibold text-black transition hover:bg-muted">
            Subscribe
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-200">
        By subscribing, you agree to our{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default EmailForm;
