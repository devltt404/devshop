import Logo from "../Logo.jsx";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container grid grid-cols-12 py-12">
        <div className="col-span-5">
          <Logo color="white" className="-ml-3" />
          <p className="my-4">
            DevShop is an online shop built with ReactJS and NodeJS.
          </p>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DevShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
