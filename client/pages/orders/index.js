import Link from "next/link";

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <ul className="list-group">
        {orders.map((order) => (
          <li key={order.id} className="list-group-item d-flex justify-content-between">
            <Link href={`/orders/${order.id}`}>{order.ticket?.title}</Link>
            <span className="badge bg-info text-dark">{order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  try {
    const { data } = await client.get("/api/orders");
    return { orders: data };
  } catch (err) {
    return { orders: [] }; // Not signed in (401), so just show an empty list.
  }
};

export default OrderIndex;
