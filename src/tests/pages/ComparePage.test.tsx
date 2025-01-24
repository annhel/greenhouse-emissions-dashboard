import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ComparePage from "../../pages/ComparePage";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ComparePage", () => {
  it("allows a user to select countries", async () => {
    const combobox = screen.getByRole("combobox", { name: "Select Countries" });

    userEvent.click(combobox);
    const option = await screen.findByText("USA");
    userEvent.click(option);

    expect(combobox).toHaveTextContent("USA");
  });

  it("allows a user to adjust the year range", async () => {
    const sliders = screen.getAllByRole("slider", { name: "Minimum distance" });
    const [startYearSlider, endYearSlider] = sliders;

    expect(startYearSlider).toHaveAttribute("aria-valuenow", "1974");
    expect(endYearSlider).toHaveAttribute("aria-valuenow", "2022");

    fireEvent.change(startYearSlider, { target: { value: 1980 } });
    fireEvent.change(endYearSlider, { target: { value: 2010 } });

    expect(startYearSlider).toHaveAttribute("aria-valuenow", "1980");
    expect(endYearSlider).toHaveAttribute("aria-valuenow", "2010");
  });

  it("the clear filters button resets the filters when clicked", async () => {
    const clearFiltersButton = screen.getByRole("button", {
      name: "Clear Filters",
    });

    userEvent.click(clearFiltersButton);

    const combobox = screen.getByRole("combobox", { name: "Select Countries" });
    expect(combobox).toHaveTextContent("");
    const sliders = screen.getAllByRole("slider", { name: "Minimum distance" });
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "1974");
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "2022");
  });

  it("displays error message if API call fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    render(<ComparePage />);

    fireEvent.click(screen.getByTestId("filters-pane"));
    fireEvent.click(screen.getByText("USA"));
    fireEvent.click(screen.getByText("China"));

    await waitFor(() =>
      expect(screen.getByText("Error loading data")).toBeVisible()
    );
  });

  it("renders CompareTable with the correct data", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          country: "USA",
          data: [{ date: 2000, value: 1000 }],
        },
        {
          country: "China",
          data: [{ date: 2000, value: 2000 }],
        },
      ],
    });

    render(<ComparePage />);

    fireEvent.click(screen.getByTestId("filters-pane"));
    fireEvent.click(screen.getByText("USA"));
    fireEvent.click(screen.getByText("China"));

    await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument());

    expect(screen.getByText("USA")).toBeVisible();
    expect(screen.getByText("China")).toBeVisible();
  });
});
