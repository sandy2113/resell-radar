/** Short explainer: curated catalogue + live trend signals (not a product feed from Google). */
export function DataExplainerBar() {
  return (
    <div className="mb-6 rounded-xl border border-cyan-200/90 bg-cyan-50/90 px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">
      <strong className="text-cyan-950">Data model:</strong> the{" "}
      <strong>product list</strong> in this app is <em>curated</em> (seed / your DB rows) —
      Google Trends does <em>not</em> return new products to buy. The Python job writes{" "}
      <strong>keyword + city interest</strong> and can update <code className="rounded bg-white/80 px-1 text-xs">trend_score</code> on those same products when
      the product name contains a tracked keyword. The app shows about{" "}
      <strong>20 curated picks per city</strong> (from <code className="rounded bg-white/80 px-1 text-xs">product_city_trend</code>);
      that is not a live shopping feed of new SKUs from Google. Prices and images stay illustrative.
    </div>
  );
}
