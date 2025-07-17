import LoginScreen from "../screens/auth/LoginScreen";

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#5E5BFD",
        tabBarInactiveTintColor: "#999",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Upload":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "Archive":
              iconName = focused ? "folder" : "folder-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          borderTopWidth: 1,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={UploadDocumentScreen} />
      <Tab.Screen name="Archive" component={ArchiveScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
