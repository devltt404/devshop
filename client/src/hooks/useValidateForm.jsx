import { useEffect } from "react";

export default function useValidateForm({ error, form }) {
  useEffect(() => {
    if (!error || !error.errors) return;
    const { errors } = error;

    Object.keys(errors).forEach((key) => {
      form.setError(key, {
        type: "server",
        message: errors[key],
      });
    });
  }, [error]);
}
