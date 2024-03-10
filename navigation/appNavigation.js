import * as React from 'react';
import {LogBox, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreens from '../screens/HomeScreens';


   const Stack = createStackNavigator();
   LogBox.ignoreLogs([
    'found in the navigation state',
   ])
   export default function App() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen name="Home" options={{headerShown :false}} component={HomeScreens} />
         </Stack.Navigator>
       </NavigationContainer>
      );
    }