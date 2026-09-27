export const VEHICLE_SETTINGS_KEY = "parksetuVehicleSettings";

export const defaultVehicleSettings = {
  car: true,
  bike: false,
};

export const getVehicleSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(VEHICLE_SETTINGS_KEY) || "null");
    return {
      ...defaultVehicleSettings,
      ...(stored && typeof stored === "object" ? stored : {}),
    };
  } catch {
    return defaultVehicleSettings;
  }
};

export const setVehicleSettings = (settings) => {
  const next = {
    ...defaultVehicleSettings,
    ...settings,
  };
  localStorage.setItem(VEHICLE_SETTINGS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("parksetuVehicleSettingsChanged"));
  return next;
};

export const isVehicleEnabled = (vehicle) => {
  const settings = getVehicleSettings();
  return vehicle === "Car" ? settings.car : settings.bike;
};
