import { toast } from "../ui/use-toast.js";

const TestCard = () => {
  return (
    <table className="mb-4 table-fixed border-collapse border text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Card Number</th>
          <th className="border px-4 py-2">Expiry Date</th>
          <th className="border px-4 py-2">CVC</th>
        </tr>
      </thead>
      <tbody className="bg-white text-secondary">
        <tr>
          <td
            className="cursor-pointer border px-4 py-2"
            onClick={() => {
              navigator.clipboard.writeText("4242 4242 4242 4242");
              toast({
                title: "Card Number",
                description: "4242 4242 4242 4242 copied",
              });
            }}
          >
            4242 4242 4242 4242
          </td>
          <td
            className="cursor-pointer border px-4 py-2"
            onClick={() => {
              navigator.clipboard.writeText("09/30");
              toast({
                title: "Expiry Date",
                description: "09/30 copied",
              });
            }}
          >
            09/30
          </td>
          <td
            className="cursor-pointer border px-4 py-2"
            onClick={() => {
              navigator.clipboard.writeText("333");
              toast({
                title: "CVC",
                description: "333 copied",
              });
            }}
          >
            333
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TestCard;
