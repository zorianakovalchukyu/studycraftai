import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/HomeScreen";
import UploadDocumentScreen from "../screens/home/UploadDocumentScreen";
import ArchiveScreen from "../screens/home/ArchiveScreen";

const Tab = createBottomTabNavigator();

const CustomUploadButton = ({ onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected;
  return (
    <TouchableOpacity
      style={[styles.uploadButton, focused && { backgroundColor: "#433AF5" }]}
      onPress={onPress}
    >
      <Ionicons name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          elevation: 8,
          zIndex: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "Archive")
            iconName = focused ? "folder" : "folder-outline";

          return iconName ? (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? "#A88BFE" : "#999"}
            />
          ) : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Upload"
        component={UploadDocumentScreen}
        options={{
          tabBarButton: (props) => <CustomUploadButton {...props} />,
        }}
      />
      <Tab.Screen name="Archive" component={ArchiveScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    top: -15,
    left: 33,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#A88BFE",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});

export default BottomTabs;
