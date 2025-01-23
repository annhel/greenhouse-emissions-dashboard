import React from "react";
import "@testing-library/jest-dom";
import "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import ComparePage from "../../pages/ComparePage";
import axios from "axios";

const context = describe;

describe("ComparePage", () => {
  const doRender = () => {
    render(<ComparePage />);
  };

  beforeAll(() => {
    doRender();
  });

  it("displays a page header", () => {
    expect(screen.getByText("Compare Greenhouse Gas Emissions")).toBeVisible();
  });

  it("displays a Filters section", () => {
    expect(screen.getByTestId("filters-pane")).toBeVisible();
  });
});
