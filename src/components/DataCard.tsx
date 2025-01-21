import InsightsIcon from "@mui/icons-material/Insights";

export type DataCardProps = {
  value: number | string;
  label: string;
  insight?: string;
};

export default function DataCard({ value, label, insight }: DataCardProps) {
  return (
    <div className="data-card-container display-flex flex-dir-col">
      <div className="data-card-header display-flex justify-space-between align-center">
        {value} <InsightsIcon />
      </div>
      <div className="data-card-sub-header">{label}</div>
      {insight && <div className="data-card-sub-header">{insight}</div>}
    </div>
  );
}
