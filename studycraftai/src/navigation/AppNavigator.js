import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthProvider";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CreateAccountOptionsScreen from "../screens/auth/CreateAccountOptionsScreen";
import RegisterStepOneScreen from "../screens/auth/RegisterStepOneScreen";
import RegisterStepTwoScreen from "../screens/auth/RegisterStepTwoScreen";
import RegisterStepThreeScreen from "../screens/auth/RegisterStepThreeScreen";
import RegisterSuccessScreen from "../screens/auth/RegisterSuccessScreen";
import LoginOptionsScreen from "../screens/auth/LoginOptionsScreen";
import UploadDocumentScreen from "../screens/home/UploadDocumentScreen";
import DocumentViewerTabScreen from "../screens/viewer/DocumentViewerTabScreen";
import GeneratingScreen from "../screens/shared/GeneratingScreen";
import BottomTabs from "./BottomTabs";
import PDFViewerScreen from "../screens/viewer/PDFViewerScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, authLoading } = useContext(AuthContext);
  console.log("authLoading:", authLoading);
  console.log("user:", user);
  if (authLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="CreateAccountOptions"
            component={CreateAccountOptionsScreen}
          />
          <Stack.Screen
            name="RegisterStepOne"
            component={RegisterStepOneScreen}
          />
          <Stack.Screen
            name="RegisterStepTwo"
            component={RegisterStepTwoScreen}
          />
          <Stack.Screen
            name="RegisterStepThree"
            component={RegisterStepThreeScreen}
          />
          <Stack.Screen
            name="RegisterSuccess"
            component={RegisterSuccessScreen}
          />
          <Stack.Screen name="LoginOptions" component={LoginOptionsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen
            name="PDFViewer"
            component={PDFViewerScreen}
            options={{ title: "Preview PDF" }}
          />
          <Stack.Screen
            name="UploadDocument"
            component={UploadDocumentScreen}
          />
          <Stack.Screen
            name="DocumentViewerTab"
            component={DocumentViewerTabScreen}
          />

          <Stack.Screen name="Generating" component={GeneratingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
