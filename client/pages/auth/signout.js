import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest(); // Run once when the page renders (must be in the browser so the cookie gets cleared).
  }, []);

  return <h1>Signing you out...</h1>;
};
