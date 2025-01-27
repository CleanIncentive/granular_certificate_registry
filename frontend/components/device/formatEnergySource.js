import { EnergySourceType } from "../../enum/device";

const formatEnergySource = (source) => {
  switch (source) {
    case EnergySourceType.SOLAR_PV:
      return "Solar PV";
    case EnergySourceType.WIND:
      return "Wind";
    case EnergySourceType.HYDRO:
      return "Hydro";
    case EnergySourceType.BIOMASS:
      return "Biomass";
    case EnergySourceType.NUCLEAR:
      return "Nuclear";
    case EnergySourceType.ELECTROLYSIS:
      return "Electrolysis";
    case EnergySourceType.GEOTHERMAL:
      return "Geothermal";
    case EnergySourceType.BATTERY_STORAGE:
      return "Battery Storage";
    case EnergySourceType.CHP:
      return "CHP";
    case EnergySourceType.OTHER:
      return "Other";
    default:
      return "Unknown";
  }
};

export default formatEnergySource;
