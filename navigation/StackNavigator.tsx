
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import IndexScreen from '../components/index';
import DashboardScreen from '../components/DashboardScreen';
import Characters from '../components/Character'; 
import DashboardScene from '../components/Scene';

export type RootStackParamList = {
  Index: undefined;
  Dashboard: undefined;
  Scenes: undefined;
  Characters: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="Index" component={IndexScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Scenes' component={DashboardScene} options ={{headerShown:false}}/>
      <Stack.Screen name="Characters" component={Characters} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
