function AQICard({ title, value, color, subtitle }) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg text-white ${color}`}>

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <h1 className="text-5xl font-bold mt-3">
        {value}
      </h1>

      <p className="mt-2">
        {subtitle}
      </p>

    </div>
  );
}

export default AQICard;