import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket, currentUser }) => {
  // Buying step 1: create an order for this ticket (this reserves it).
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => Router.push(`/orders/${order.id}`), // Go to the order page to pay.
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: R {Number(ticket.price).toFixed(2)}</h4>
      {errors}
      {!currentUser && <p>Sign in to buy this ticket.</p>}
      {currentUser && ticket.orderId && <p className="text-muted">This ticket is already reserved.</p>}
      {currentUser && !ticket.orderId && (
        <button className="btn btn-primary" onClick={() => doRequest()}>
          Buy
        </button>
      )}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query; // ticketId comes from the file name [ticketId].js.
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
