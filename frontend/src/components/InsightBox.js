function InsightBox({ insights }) {
  return (
    <div className="bg-yellow-100 p-5 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-4">
        Smart Insights
      </h2>

      <ul className="space-y-3">
        {insights.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default InsightBox;