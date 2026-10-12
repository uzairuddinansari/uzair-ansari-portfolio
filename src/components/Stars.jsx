export default function Stars({ value }) {
  const rating = Number(value);
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <i>{"★".repeat(5 - rating)}</i>
    </span>
  );
}
