import LogoIcon from "../icons/LogoIcon.jsx";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container grid grid-cols-12 py-10">
        <div className="col-span-5">
          <LogoIcon className="w-52" />
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
