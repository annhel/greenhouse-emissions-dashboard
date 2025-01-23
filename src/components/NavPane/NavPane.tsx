import NavButtons from "./NavButtons";

export default function NavPane() {
  return (
    <>
      <div
        className="nav-pane-container"
        style={{
          width: "20%",
          height: "100vh",
          background: "#022d5b",
          position: "fixed",
        }}
      >
        <div style={{ color: "white", margin: "4rem" }}>
          <div
            style={{
              flexWrap: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
              style={{ borderRadius: "15px" }}
            />
            <h1>Globalytics</h1>
          </div>
          <h4>Tracking emissions, Globally.</h4>
        </div>
        <NavButtons />
      </div>
    </>
  );
}
