import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import FirstScreen from '../screens/FirstScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchScreen from '../screens/SearchScreen';
import MovieInfo from '../screens/MovieInfo';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#110e47',
        inactiveTintColor: '#BCBCCD',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          //   initialRouteName={FirstScreen}
          screenOptions={{
            // cardStyleInterpolator: CardStyleInterpolators.f
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <Stack.Screen
            name="FirstScreen"
            component={FirstScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={HomeScreen}
        screenOptions={{
          // cardStyleInterpolator: CardStyleInterpolators.f
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen
          name="HomeScreen"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="movieInfo"
          component={MovieInfo}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// function RootNavigator() {
//   return (

//   );
// }

export default RootNavigator;
