import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch: (cityName: string) => void;
  onLocationPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationPress }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
      Keyboard.dismiss();
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="rgba(255, 255, 255, 0.8)"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search city (e.g. Tokyo, Paris)..."
          placeholderTextColor="rgba(255, 255, 255, 0.65)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="words"
          selectionColor="#FFFFFF"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="rgba(255, 255, 255, 0.7)"
            />
          </TouchableOpacity>
        )}
      </View>

      {onLocationPress && (
        <TouchableOpacity
          onPress={onLocationPress}
          style={styles.locationButton}
          activeOpacity={0.7}
          accessibilityLabel="Use current location"
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
    width: "100%",
    zIndex: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});