import { useState } from "react";
import FiltersPane from "../components/FiltersPane";
import NavPane from "../components/NavPane/NavPane";

export default function ComparePage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <NavPane />
      <div className="page-container width-100">
        <h1 className="color-primary">Compare Greenhouse Gas Emissions</h1>

        <div className="page-sub-header">
          Compare greenhouse gas emissions between countries and over time.
          Select countries and time ranges to visualize trends and differences
          in emissions.
        </div>
        <FiltersPane />
        {countries && years ? (
          <p
            style={{
              justifySelf: "center",
              color: "grey",
              fontSize: "20px",
              marginTop: "4rem",
            }}
          >
            Select at least two countries to begin visualizing!{" "}
          </p>
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error loading data</p>
        ) : (
          <>
            <div className="mt-3rem">
              <h2 className="color-primary">Key Insights</h2>
            </div>
          </>
        )}
      </div>
    </>
  );
}
