import Router from "next/router";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  // Buying step 2: the mock payment (no card details, it just completes the order).
  const pay = useRequest({
    url: `/api/orders/${order.id}/pay`,
    method: "post",
    body: {},
    onSuccess: () => Router.push("/orders"),
  });

  // Changed your mind? Cancelling releases the ticket for someone else.
  const cancel = useRequest({
    url: `/api/orders/${order.id}`,
    method: "delete",
    onSuccess: () => Router.push("/orders"),
  });

  return (
    <div>
      <h1>Order for {order.ticket.title}</h1>
      <h4>Total: R {Number(order.ticket.price).toFixed(2)}</h4>
      <p>
        Status: <strong>{order.status}</strong>
      </p>
      {pay.errors}
      {cancel.errors}
      {order.status === "created" && (
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => pay.doRequest()}>
            Pay (mock)
          </button>
          <button className="btn btn-outline-danger" onClick={() => cancel.doRequest()}>
            Cancel order
          </button>
        </div>
      )}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
