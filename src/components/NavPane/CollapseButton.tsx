import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export default function CollapseButton() {
  return (
    <div
      className="collapse-button"
      style={{ maxWidth: "20%", height: "100vh" }}
    >
      <div style={{background: "#022d5b", color: "#f5c504", margin: "6rem 0", padding: "15px 0px 11px 10px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px"}}>
        <ArrowBackIosIcon />
      </div>
    </div>
  );
}
