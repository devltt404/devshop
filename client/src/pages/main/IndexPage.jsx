import ProductCard from "@/components/ProductCard.jsx";
import { CheckIcon, Flame } from "lucide-react";
import HeroBg from "../../assets/hero.png";

export default function IndexPage() {
  return (
    <div className="container">
      <img src={HeroBg} />

      {/* Categories */}
      <section className="my-16">
        <h2 className="mb-2 text-center text-3xl font-semibold">Categories</h2>
        <p className="mb-10 text-center text-muted-foreground">
          We offer a wide range of categories to choose from, let's explore!
        </p>

        <ul className="flex gap-8">
          <li className="inline-flex flex-col items-center gap-2">
            <div className="inline-flex h-44 w-52 items-center justify-center rounded-md bg-slate-50 p-6">
              <img src="https://res.cloudinary.com/db9v5ywkw/image/upload/v1717474995/2_enz8ow.png" />
            </div>
            <p className="text-lg font-medium">Laptop</p>
          </li>
        </ul>
      </section>

      {/* Hot sale */}
      <section className="my-16 rounded-lg bg-muted px-8 py-10">
        <div className="mb-6 flex items-center gap-2 text-red-600">
          <Flame className="h-7 w-7" />
          <h2 className="text-3xl font-semibold">Hot Sale!</h2>
        </div>

        <div className="flex">
          <ProductCard />
        </div>
      </section>

      {/* Popular */}
      <section className="my-16 px-8">
        <h2 className="mb-6 text-3xl font-semibold">Most Popular</h2>

        <div className="flex">
          <ProductCard />
        </div>
      </section>

      {/* Popular */}
      <section className="my-16 px-8">
        <h2 className="mb-6 text-3xl font-semibold">Latest Arrivals</h2>

        <div className="flex">
          <ProductCard />
        </div>
      </section>

      {/* Email Form */}
      <div className="my-16 rounded-xl bg-gradient-to-t from-black to-[rgba(0,0,0,0.8)] py-24 text-white">
        <h2 className="text-center text-3xl font-semibold">
          WANT TO GET LATEST UPDATES?
        </h2>

        <div className="my-10 flex flex-col items-center gap-2">
          <p className="text-white">
            Subscribe to our newsletter to get notified about:
          </p>

          <div>
            <span className="mr-8 inline-flex items-center gap-2">
              <CheckIcon className="h-4 w-4" />
              <p>Product releases</p>
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckIcon className="h-4 w-4" />
              <p>Discounts</p>
            </span>
          </div>
        </div>

        <form className="mt-6 flex justify-center">
          <div className="flex w-full max-w-md rounded-md border border-white shadow-outer">
            <input
              type="email"
              className="flex-1 bg-transparent px-4 outline-none"
              placeholder="Your email address"
            />
            <button className="bg-white px-4 py-3 font-medium text-black transition hover:bg-muted">
              Subscribe
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-neutral-400">
          By subscribing, you agree to our{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
