import { useNavigate } from "react-router";

export function HecateLogo() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-3 cursor-pointer"
    >
      <div className="size-7 rounded-[7px] bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-[13px] font-bold text-primary-foreground">H</span>
      </div>
      <span
        className="text-[15px] font-semibold text-foreground uppercase select-none"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.18em" }}
      >
        Hefestos
      </span>
    </button>
  );
}
