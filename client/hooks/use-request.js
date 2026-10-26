import axios from "axios";
import { useState } from "react";

// Small hook that makes a request and renders our common { errors: [...] } structure if it fails.
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null); // Clear old errors before trying again.

      const response = await axios[method](url, { ...body, ...props }); // Merge the body with any extra props.

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errs = err.response?.data?.errors || [{ message: "Something went wrong" }];
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {errs.map((e, index) => (
              <li key={index}>{e.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
