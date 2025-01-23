import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const getAllEmissionsByCountry = async (country: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}country/${country}/indicator/EN.GHG.ALL.MT.CE.AR5?format=json`
    );
    return response;
  } catch (err) {
    throw new Error("Failed to fetch emissions data");
  }
};
