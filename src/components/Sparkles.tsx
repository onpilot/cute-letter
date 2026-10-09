const items = [
  { e: "✨", x: "8%", y: "10%", d: "0s", s: "1.6rem" },
  { e: "💙", x: "86%", y: "14%", d: "1.2s", s: "1.4rem" },
  { e: "🌸", x: "14%", y: "72%", d: "2.1s", s: "1.8rem" },
  { e: "✨", x: "80%", y: "66%", d: "0.6s", s: "1.3rem" },
  { e: "🩷", x: "48%", y: "92%", d: "1.7s", s: "1.3rem" },
];

export default function Sparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((it, i) => (
        <span
          key={i}
          className="float absolute"
          style={{ left: it.x, top: it.y, fontSize: it.s, animationDelay: it.d }}
        >
          {it.e}
        </span>
      ))}
    </div>
  );
}
