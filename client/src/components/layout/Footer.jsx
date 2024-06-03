import Logo from "../Logo.jsx";

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="container grid grid-cols-12 py-12">
        <div className="col-span-5">
          <Logo color="white" className="-ml-3" />
          <p className="my-4 text-neutral-400">
            DevShop is an online shop built with ReactJS and NodeJS.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center">
        <p className="text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} DevShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
