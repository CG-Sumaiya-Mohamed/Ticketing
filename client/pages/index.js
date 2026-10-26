import Link from "next/link";

const LandingPage = ({ tickets }) => {
  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>R {Number(ticket.price).toFixed(2)}</td>
      <td>{ticket.orderId ? <span className="badge bg-secondary">Reserved</span> : <span className="badge bg-success">Available</span>}</td>
      <td>
        {/* href is the page file, the real url is built from the ticket id. */}
        <Link href={`/tickets/${ticket.id}`}>View</Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
