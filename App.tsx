import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import StackNavigator from "./navigation/StackNavigator";
import { QueryClientProvider, QueryClient } from "react-query";

enableScreens();

const client = new QueryClient();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <QueryClientProvider client={client}>
        <StackNavigator />
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
