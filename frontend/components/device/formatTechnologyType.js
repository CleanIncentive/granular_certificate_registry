import { TechnologyType } from "../../enum/device";

const formatTechnologyType = (source) => {
  switch (source) {
    case TechnologyType.SOLAR_PV:
      return "Solar PV";
    case TechnologyType.WIND_TURBINE:
      return "Wind Turbine";
    case TechnologyType.HYDRO:
      return "Hydro";
    case TechnologyType.BATTERY_STORAGE:
      return "Battery Storage";
    case TechnologyType.OTHER_STORAGE:
      return "other Storage";
    case TechnologyType.CHP:
      return "CHP";
    case TechnologyType.OTHER:
      return "Other";
    default:
      return "Unknown";
  }
};

export default formatTechnologyType;
