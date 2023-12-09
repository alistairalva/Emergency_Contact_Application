import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FirstScreen from '../screens/FirstScreen';
import LoginScreen from '../screens/SecondScreen';
import RegistrationScreen from '../screens/ThirdScreen';
import EditContactScreen from '../screens/FourthScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                headerMode="screen"
                screenOptions={{
                    headerTintColor: Platform.OS === 'android' ? '#000' : 'blue',
                    headerStyle: {
                        backgroundColor: Platform.OS === 'android' ? '#FFF' : ''
                    }
                }}
            >
                <Stack.Screen
                    name="ScreenOne"
                    component={FirstScreen}
                    options={{
                        title: 'Main Screen',
                    }}
                />
                <Stack.Screen
                    name="ScreenTwo"
                    component={LoginScreen}
                    options={{
                        title: 'Contact List',
                    }}
                />
                <Stack.Screen
                    name="ScreenThree"
                    component={RegistrationScreen}
                    options={{
                        title: 'Register for App',
                    }}
                />
                <Stack.Screen
                    name="ScreenFour"
                    component={EditContactScreen}
                    options={{
                        title: 'Edit Contact',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;