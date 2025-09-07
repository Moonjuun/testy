import TarotBackFace from "./TarotBackFace";
import PositionBadge from "./PositionBadge";

/* 결과 격자에서 쓰는 3D 카드 (항상 ‘뒷면’만 노출) */
export default function TarotCard3D({
  index,
  label,
  onOpen,
}: {
  index: number;
  label: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${label} 카드 자세히 보기`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={[
        "group relative w-24 h-36 md:w-32 md:h-48",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      ].join(" ")}
      style={{ perspective: "1200px" }}
    >
      <div
        className={[
          "relative w-full h-full rounded-xl transition-transform duration-300",
          "shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
          "group-hover:-translate-y-1",
          "group-hover:[transform:rotateX(10deg)_rotateY(-6deg)]",
        ].join(" ")}
      >
        {/* 빛나는 경계 */}
        <div className="pointer-events-none absolute -inset-[2px] rounded-[14px] bg-[conic-gradient(from_0deg,hsla(var(--accent),.35),transparent_40%)] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity" />
        {/* 뒷면 */}
        <TarotBackFace index={index} />
      </div>

      {/* 아래 라벨(포지션) — 예쁘게 리디자인 */}
      <div className="mt-4">
        <PositionBadge>{label}</PositionBadge>
      </div>
    </button>
  );
}
