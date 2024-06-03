import { useEffect } from "react";

export default function useValidateForm({ error, form }) {
  useEffect(() => {
    if (!error) return;
    const { errors } = error;

    Object.keys(errors).forEach((key) => {
      form.setError(key, {
        type: "manual",
        message: errors[key],
      });
    });
  }, [error]);
}
