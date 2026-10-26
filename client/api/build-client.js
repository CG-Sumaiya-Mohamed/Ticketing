import axios from "axios";

// Returns an axios instance that works whether getInitialProps runs on the server or in the browser.
export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server (inside the cluster / compose network).
    // We go through the ingress (or the compose gateway) and forward the browser's headers (Host + cookie).
    return axios.create({
      baseURL: process.env.SERVER_API_URL || "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We are in the browser, relative urls go to whatever domain we're on.
    return axios.create({
      baseURL: "/",
    });
  }
};
