import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/user-event";
import FiltersPane, { FiltersPaneProps } from "../../components/FiltersPane";

const context = describe;

describe("FiltersPane", () => {
  const doRender = (props: Partial<FiltersPaneProps>) => {
    render(
      <FiltersPane
        countries={props.countries ?? []}
        years={props.years ?? [2000, 2010]}
        setCountries={props.setCountries ?? jest.fn()}
        setYears={props.setYears ?? jest.fn()}
      />
    );
  };

  it("displays a filter for country selection", () => {
    doRender({});
    expect(
      screen.getByRole("combobox", { name: "Select Countries" })
    ).toBeVisible();
  });

  it("displays a filter for adjusting date ranges", () => {
    doRender({});
    expect(
      screen.getByRole("slider", { name: "Set Date Range" })
    ).toBeVisible();
  });
});
