export const WEATHER_API_KEY = "d759137b3bfcbe19e5d4ecd307017490";
export const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const normalizeCondition = (condition?: string): string => {
  if (!condition) return "Clear";
  const norm = condition.toLowerCase();
  if (norm.includes("clean") || norm.includes("clear") || norm.includes("sun")) return "Clear";
  if (norm.includes("cloud") || norm.includes("overcast")) return "Clouds";
  if (norm.includes("thunder") || norm.includes("storm") || norm.includes("lightning")) return "Thunderstorm";
  if (norm.includes("drizzle")) return "Drizzle";
  if (norm.includes("rain")) return "Rain";
  if (norm.includes("snow") || norm.includes("sleet") || norm.includes("ice")) return "Snow";
  if (norm.includes("fog") || norm.includes("mist") || norm.includes("smoke")) return "Mist";
  if (norm.includes("haze") || norm.includes("dust") || norm.includes("sand") || norm.includes("ash")) return "Haze";
  return condition;
};

export const getBackgroundImage = (rawCondition: string, icon: string) => {
  const isNight = icon?.includes("n");
  const condition = normalizeCondition(rawCondition);

  if (isNight) {
    switch (condition) {
      case "Clear":
        return require("../assets/night/clear.jpg");
      case "Clouds":
        return require("../assets/night/clouds.jpg");
      case "Rain":
        return require("../assets/night/rain.jpg");
      case "Snow":
        return require("../assets/night/snow.jpg");
      case "Thunderstorm":
        return require("../assets/night/thunderstorm.jpg");
      case "Drizzle":
        return require("../assets/night/drizzle.jpg");
      case "Mist":
        return require("../assets/night/mist.jpg");
      case "Haze":
        return require("../assets/night/haze.jpg");
      default:
        return require("../assets/night/clear.jpg");
    }
  }

  switch (condition) {
    case "Clear":
      return require("../assets/day/clear.jpg");
    case "Clouds":
      return require("../assets/day/clouds.jpg");
    case "Rain":
      return require("../assets/day/rain.jpg");
    case "Snow":
      return require("../assets/day/snow.jpg");
    case "Thunderstorm":
      return require("../assets/day/thunderstorm.jpg");
    case "Drizzle":
      return require("../assets/day/drizzle.jpg");
    case "Mist":
      return require("../assets/day/mist.jpg");
    case "Haze":
      return require("../assets/day/haze.jpg");
    default:
      return require("../assets/day/clear.jpg");
  }
};

export const getWeatherIcon = (icon: string, rawCondition: string) => {
  const isNight = icon?.includes("n");
  const condition = normalizeCondition(rawCondition);

  switch (condition) {
    case "Clear":
      return isNight ? require("../assets/icons/night/clear.png") : require("../assets/icons/day/clear.png");
    case "Clouds":
      return isNight ? require("../assets/icons/night/clouds.png") : require("../assets/icons/day/clouds.png");
    case "Rain":
      return isNight ? require("../assets/icons/night/rain.png") : require("../assets/icons/day/rain.png");
    case "Snow":
      return isNight ? require("../assets/icons/night/snow.png") : require("../assets/icons/day/snow.png");
    case "Thunderstorm":
      return isNight ? require("../assets/icons/night/thunderstorm.png") : require("../assets/icons/day/thunderstorm.png");
    case "Drizzle":
      return isNight ? require("../assets/icons/night/drizzle.png") : require("../assets/icons/day/drizzle.png");
    case "Mist":
      return isNight ? require("../assets/icons/night/mist.png") : require("../assets/icons/day/mist.png");
    case "Haze":
      return isNight ? require("../assets/icons/night/haze.png") : require("../assets/icons/day/haze.png");
    default:
      return isNight ? require("../assets/icons/night/clear.png") : require("../assets/icons/day/clear.png");
  }
};

export const getWeatherColor = (condition: string, icon: string) => {
  const isNight = icon?.includes("n");
  if (isNight) return "#F1F5F9";

  switch (normalizeCondition(condition)) {
    case "Clear":
      return "#F1F5F9";
    case "Clouds":
      return "#E2E8F0";
    case "Rain":
      return "#CBD5E1";
    case "Snow":
      return "#F8FAFC";
    case "Thunderstorm":
      return "#E2E8F0";
    case "Drizzle":
      return "#E2E8F0";
    case "Mist":
    case "Haze":
      return "#E5E7EB";
    default:
      return "#F1F5F9";
  }
};

export const getWeatherImageUrl = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

export const formatTemperature = (temp?: number): string => {
  if (temp === undefined || temp === null) return "--";
  return `${Math.round(temp)}°`;
};

export const formatWindSpeed = (speedMs?: number): string => {
  if (speedMs === undefined || speedMs === null) return "--";
  const kmh = Math.round(speedMs * 3.6);
  return `${kmh} km/h`;
};

export const getWindDirection = (deg?: number): string => {
  if (deg === undefined || deg === null) return "";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
};

export const formatUnixTime = (timestamp?: number): string => {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
};

export const formatForecastDay = (timestamp: number, index: number): string => {
  if (index === 0) return "Today";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { weekday: "short" });
};

export const formatForecastHour = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "numeric", hour12: true });
};

export const getAQIDetails = (aqi?: number) => {
  switch (aqi) {
    case 1:
      return { label: "Good", color: "#4ADE80", description: "Air quality is ideal for outdoor activities." };
    case 2:
      return { label: "Fair", color: "#FACC15", description: "Air quality is acceptable." };
    case 3:
      return { label: "Moderate", color: "#FB923C", description: "Sensitive groups may experience symptoms." };
    case 4:
      return { label: "Poor", color: "#F87171", description: "Unhealthy for sensitive individuals." };
    case 5:
      return { label: "Very Poor", color: "#C084FC", description: "Health alert: high risk of irritation." };
    default:
      return { label: "Moderate", color: "#38BDF8", description: "Air quality data available." };
  }
};