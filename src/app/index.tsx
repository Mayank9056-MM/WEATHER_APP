import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWeather } from "@/hooks/useWeather";
import { getBackgroundImage } from "@/utils/weatherUtils";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";

export default function Index() {
  const {
    loading,
    refreshing,
    errorMsg,
    weather,
    forecast,
    api,
    getLocationWeather,
    searchCity,
    refreshWeather,
    clearError,
  } = useWeather();

  // Initial loading state (only when no weather is yet cached or loaded)
  if (loading && !weather) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingTitle}>Atmosphere</Text>
          <Text style={styles.loadingSubtitle}>
            Fetching live weather conditions...
          </Text>
        </View>
      </View>
    );
  }

  // Fatal error state (only when no weather is loaded at all)
  if (!weather) {
    return (
      <View style={styles.fatalContainer}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.fatalInner}>
          <SearchBar onSearch={searchCity} onLocationPress={getLocationWeather} />
          <View style={styles.fatalCard}>
            <MaterialCommunityIcons
              name="cloud-off-outline"
              size={56}
              color="#F87171"
            />
            <Text style={styles.fatalTitle}>Weather Unavailable</Text>
            <Text style={styles.fatalDescription}>
              {errorMsg ||
                "Unable to retrieve weather data. Please check your internet connection and try again."}
            </Text>
            <TouchableOpacity
              onPress={getLocationWeather}
              style={styles.retryButton}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const currentCondition = weather.weather[0]?.main || "Clear";
  const currentIcon = weather.weather[0]?.icon || "01d";
  const bgImage = getBackgroundImage(currentCondition, currentIcon);

  return (
    <ImageBackground source={bgImage} style={styles.bgImage} resizeMode="cover">
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          {/* Top Search & Actions Bar */}
          <SearchBar
            onSearch={searchCity}
            onLocationPress={getLocationWeather}
          />

          {/* Non-fatal Floating Error Banner */}
          {errorMsg ? (
            <View style={styles.toastBanner}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={18}
                color="#F87171"
              />
              <Text style={styles.toastText} numberOfLines={2}>
                {errorMsg}
              </Text>
              <TouchableOpacity
                onPress={clearError}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={16}
                  color="rgba(255, 255, 255, 0.7)"
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Main Weather Scroll View */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshWeather}
                tintColor="#FFFFFF"
                colors={["#FFFFFF"]}
              />
            }
          >
            <CurrentWeather
              weather={weather}
              api={api}
              forecast={forecast}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 15, 25, 0.38)",
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 4,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 20, 25, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.4)",
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toastText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#FEE2E2",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    alignItems: "center",
    gap: 12,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    marginTop: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.65)",
  },
  fatalContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  fatalInner: {
    flex: 1,
  },
  fatalCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  fatalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  fatalDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 24,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
