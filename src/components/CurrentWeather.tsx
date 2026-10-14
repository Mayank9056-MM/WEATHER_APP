import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  ViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { AQIData, ForecastData, WeatherData } from "@/types/weather";
import {
  formatForecastDay,
  formatForecastHour,
  formatTemperature,
  formatUnixTime,
  formatWindSpeed,
  getAQIDetails,
  getWeatherIcon,
  getWindDirection,
} from "@/utils/weatherUtils";

const { width } = Dimensions.get("window");

interface CurrentWeatherProps {
  weather: WeatherData;
  api: AQIData | null;
  forecast?: ForecastData[];
}

export const GlassCard: React.FC<
  ViewProps & { style?: StyleProp<ViewStyle>; children: React.ReactNode }
> = ({ style, children, ...props }) => {
  return (
    <GlassView style={[styles.glassCard, style]} {...props}>
      {children}
    </GlassView>
  );
};

export const StatItem = ({
  icon,
  value,
  label,
  subLabel,
  color = "#FFFFFF",
}: {
  icon: string;
  value: string;
  label: string;
  subLabel?: string;
  color?: string;
}) => {
  return (
    <GlassView style={styles.statItem}>
      <View style={styles.statHeader}>
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={color}
          style={styles.statIcon}
        />
        <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subLabel ? <Text style={styles.statSubLabel}>{subLabel}</Text> : null}
    </GlassView>
  );
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  api,
  forecast = [],
}) => {
  const currentCondition = weather.weather[0]?.main || "Clear";
  const currentDesc = weather.weather[0]?.description || "";
  const currentIcon = weather.weather[0]?.icon || "01d";
  const iconSource = getWeatherIcon(currentIcon, currentCondition);

  // Group 5-day forecast by day
  const dailyForecasts = React.useMemo(() => {
    if (!forecast || forecast.length === 0) return [];

    const map = new Map<string, { min: number; max: number; item: ForecastData }>();

    forecast.forEach((item) => {
      const dateKey = new Date(item.dt * 1000).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, {
          min: item.main.temp_min,
          max: item.main.temp_max,
          item,
        });
      } else {
        const entry = map.get(dateKey)!;
        entry.min = Math.min(entry.min, item.main.temp_min);
        entry.max = Math.max(entry.max, item.main.temp_max);
      }
    });

    return Array.from(map.values()).slice(0, 5);
  }, [forecast]);

  // Hourly forecast slice
  const hourlySlice = (forecast || []).slice(0, 10);
  const aqiDetails = getAQIDetails(api?.main?.aqi);

  // Formatted date
  const formattedDate = new Date(weather.dt * 1000).toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      {/* City & Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#FFFFFF" />
          <Text style={styles.cityName}>
            {weather.name}
            {weather.sys.country ? `, ${weather.sys.country}` : ""}
          </Text>
        </View>

        <Text style={styles.dateText}>{formattedDate}</Text>

        <View style={styles.temperatureRow}>
          <Image source={iconSource} style={styles.mainIcon} resizeMode="contain" />
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)}°
          </Text>
        </View>

        <Text style={styles.conditionText}>
          {currentDesc.charAt(0).toUpperCase() + currentDesc.slice(1)}
        </Text>

        <View style={styles.tempRangeRow}>
          <Text style={styles.tempRangeText}>
            H: {formatTemperature(weather.main.temp_max)}  •  L:{" "}
            {formatTemperature(weather.main.temp_min)}
          </Text>
          <Text style={styles.feelsLikeText}>
            Feels like {formatTemperature(weather.main.feels_like)}
          </Text>
        </View>
      </View>

      {/* Hourly Forecast */}
      {hourlySlice.length > 0 && (
        <GlassCard style={styles.hourlyCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="rgba(255, 255, 255, 0.75)"
            />
            <Text style={styles.cardTitle}>HOURLY FORECAST</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScrollContent}
          >
            {hourlySlice.map((item, idx) => {
              const hourLabel =
                idx === 0 ? "Now" : formatForecastHour(item.dt);
              const itemIcon = getWeatherIcon(
                item.weather[0]?.icon || "01d",
                item.weather[0]?.main || "Clear"
              );
              const popPercent = Math.round((item.pop || 0) * 100);

              return (
                <View key={item.dt.toString()} style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{hourLabel}</Text>
                  <Image
                    source={itemIcon}
                    style={styles.hourlyIcon}
                    resizeMode="contain"
                  />
                  {popPercent > 20 ? (
                    <Text style={styles.hourlyPop}>{popPercent}%</Text>
                  ) : (
                    <View style={styles.popPlaceholder} />
                  )}
                  <Text style={styles.hourlyTemp}>
                    {formatTemperature(item.main.temp)}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </GlassCard>
      )}

      {/* Key Atmospheric Stats Grid */}
      <View style={styles.statsGrid}>
        <StatItem
          icon="water-percent"
          label="Humidity"
          value={`${weather.main.humidity}%`}
          subLabel={`Dew point is ~${Math.round(weather.main.temp - (100 - weather.main.humidity) / 5)}°`}
          color="#38BDF8"
        />

        <StatItem
          icon="weather-windy"
          label="Wind"
          value={formatWindSpeed(weather.wind.speed)}
          subLabel={`Direction ${getWindDirection(weather.wind.deg)} (${weather.wind.deg}°)`}
          color="#A7F3D0"
        />

        <StatItem
          icon="gauge"
          label="Pressure"
          value={`${weather.main.pressure} hPa`}
          subLabel={weather.main.pressure > 1013 ? "High pressure" : "Normal pressure"}
          color="#FDE047"
        />

        <StatItem
          icon="eye-outline"
          label="Visibility"
          value={
            weather.visibility
              ? `${(weather.visibility / 1000).toFixed(1)} km`
              : "10 km"
          }
          subLabel={
            (weather.visibility ?? 10000) >= 10000
              ? "Clear visibility"
              : "Reduced visibility"
          }
          color="#F472B6"
        />

        <StatItem
          icon="weather-sunset-up"
          label="Sunrise"
          value={formatUnixTime(weather.sys.sunrise)}
          subLabel={`Sunset: ${formatUnixTime(weather.sys.sunset)}`}
          color="#FB923C"
        />

        <StatItem
          icon="thermometer"
          label="Feels Like"
          value={formatTemperature(weather.main.feels_like)}
          subLabel={
            weather.main.feels_like < weather.main.temp
              ? "Wind makes it feel cooler"
              : "Humidity makes it feel warmer"
          }
          color="#FB7185"
        />
      </View>

      {/* Air Quality Index Card */}
      {api && (
        <GlassCard style={styles.aqiCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="air-filter"
              size={18}
              color="rgba(255, 255, 255, 0.75)"
            />
            <Text style={styles.cardTitle}>AIR QUALITY</Text>
          </View>

          <View style={styles.aqiMainRow}>
            <View style={styles.aqiBadgeContainer}>
              <View
                style={[
                  styles.aqiColorDot,
                  { backgroundColor: aqiDetails.color },
                ]}
              />
              <Text style={styles.aqiLabelText}>{aqiDetails.label}</Text>
              <Text style={styles.aqiNumberText}>(AQI {api.main.aqi} / 5)</Text>
            </View>
            <Text style={styles.aqiDescription}>{aqiDetails.description}</Text>
          </View>

          {/* Pollutant Pills */}
          <View style={styles.pollutantsRow}>
            {api.components.pm2_5 !== undefined && (
              <View style={styles.pollutantPill}>
                <Text style={styles.pollutantName}>PM2.5</Text>
                <Text style={styles.pollutantValue}>
                  {api.components.pm2_5.toFixed(1)}
                </Text>
              </View>
            )}
            {api.components.pm10 !== undefined && (
              <View style={styles.pollutantPill}>
                <Text style={styles.pollutantName}>PM10</Text>
                <Text style={styles.pollutantValue}>
                  {api.components.pm10.toFixed(1)}
                </Text>
              </View>
            )}
            {api.components.o3 !== undefined && (
              <View style={styles.pollutantPill}>
                <Text style={styles.pollutantName}>O₃</Text>
                <Text style={styles.pollutantValue}>
                  {api.components.o3.toFixed(1)}
                </Text>
              </View>
            )}
            {api.components.no2 !== undefined && (
              <View style={styles.pollutantPill}>
                <Text style={styles.pollutantName}>NO₂</Text>
                <Text style={styles.pollutantValue}>
                  {api.components.no2.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </GlassCard>
      )}

      {/* 5-Day Forecast Card */}
      {dailyForecasts.length > 0 && (
        <GlassCard style={styles.forecastCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={18}
              color="rgba(255, 255, 255, 0.75)"
            />
            <Text style={styles.cardTitle}>5-DAY FORECAST</Text>
          </View>

          <View style={styles.forecastList}>
            {dailyForecasts.map((entry, idx) => {
              const dayName = formatForecastDay(entry.item.dt, idx);
              const icon = getWeatherIcon(
                entry.item.weather[0]?.icon || "01d",
                entry.item.weather[0]?.main || "Clear"
              );
              const desc = entry.item.weather[0]?.main || "";

              return (
                <View key={entry.item.dt.toString()} style={styles.forecastRow}>
                  <Text style={styles.forecastDay}>{dayName}</Text>
                  <View style={styles.forecastIconCol}>
                    <Image
                      source={icon}
                      style={styles.forecastRowIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.forecastDesc}>{desc}</Text>
                  </View>
                  <View style={styles.forecastTempRange}>
                    <Text style={styles.forecastMin}>
                      {formatTemperature(entry.min)}
                    </Text>
                    <View style={styles.forecastBar} />
                    <Text style={styles.forecastMax}>
                      {formatTemperature(entry.max)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </GlassCard>
      )}
    </View>
  );
};

export default CurrentWeather;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 14,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cityName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  temperatureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  mainIcon: {
    width: 80,
    height: 80,
  },
  temperature: {
    fontSize: 82,
    fontWeight: "300",
    color: "#FFFFFF",
    lineHeight: 90,
    letterSpacing: -2,
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tempRangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  tempRangeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  feelsLikeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 24,
    padding: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.75)",
    letterSpacing: 0.8,
  },
  hourlyCard: {
    width: "100%",
  },
  hourlyScrollContent: {
    gap: 16,
    paddingVertical: 4,
  },
  hourlyItem: {
    alignItems: "center",
    minWidth: 54,
  },
  hourlyTime: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 6,
  },
  hourlyIcon: {
    width: 38,
    height: 38,
  },
  hourlyPop: {
    fontSize: 11,
    fontWeight: "700",
    color: "#38BDF8",
    marginTop: 2,
  },
  popPlaceholder: {
    height: 16,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    width: "100%",
  },
  statItem: {
    width: (width - 40 - 12) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 20,
    padding: 14,
    justifyContent: "space-between",
    minHeight: 108,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    opacity: 0.95,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 4,
  },
  statSubLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
  },
  aqiCard: {
    width: "100%",
  },
  aqiMainRow: {
    marginBottom: 12,
  },
  aqiBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  aqiColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  aqiLabelText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  aqiNumberText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.7)",
  },
  aqiDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  pollutantsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  pollutantPill: {
    flex: 1,
    minWidth: 65,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  pollutantName: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  pollutantValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  forecastCard: {
    width: "100%",
  },
  forecastList: {
    gap: 12,
  },
  forecastRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  forecastDay: {
    width: 60,
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  forecastIconCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  forecastRowIcon: {
    width: 28,
    height: 28,
  },
  forecastDesc: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.75)",
    width: 75,
  },
  forecastTempRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 90,
    justifyContent: "flex-end",
  },
  forecastMin: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.65)",
    width: 28,
    textAlign: "right",
  },
  forecastBar: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 2,
  },
  forecastMax: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    width: 28,
    textAlign: "right",
  },
});