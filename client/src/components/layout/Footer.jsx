export default function Footer() {
  return (
    <footer className="border-t-2 border-primary bg-primary text-primary-foreground">
      <div className="container grid grid-cols-12 py-10">
        <div className="col-span-5">
          <p className="text-4xl font-extrabold">Enjoy your shopping!</p>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center">
        <p className="text-sm text-gray-300">
          &copy; {new Date().getFullYear()} DevShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
