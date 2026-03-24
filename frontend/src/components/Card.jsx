export default function Card({ title, value }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <p>{value}</p>
    </section>
  );
}
