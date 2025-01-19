import InsightsIcon from "@mui/icons-material/Insights";

export type DataCardProps = {
  value: number | string;
  label: string;
  insight?: string;
};

export default function DataCard({ value, label, insight }: DataCardProps) {
  return (
    <div
      style={{
        borderRadius: "15px",
        padding: "2rem",
        border: "2px solid rgba(2, 45, 91, 0.33)",
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: "bolder",
          fontSize: "40px",
          color: "#022d5b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {value} <InsightsIcon />
      </div>
      <div style={{ fontWeight: "bolder", fontSize: "20px", color: "#022d5b" }}>
        {label}
      </div>
      {insight && (
        <div
          style={{ fontWeight: "bolder", fontSize: "15px", color: "#022d5b" }}
        >
          {insight}
        </div>
      )}
    </div>
  );
}
