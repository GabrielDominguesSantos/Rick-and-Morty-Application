import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CharactersListScreen from '../screens/CharactersListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
        initialRouteName="CharactersList"
        >
        <Stack.Screen 
            name="CharactersList" 
            component={CharactersListScreen} 
            options={{ title: 'Character List' }} 
        />
        <Stack.Screen 
            name="CharacterDetail" 
            component={CharacterDetailScreen} 
            options={{ title: 'Details' }} 
        />
        </Stack.Navigator>
    );
};

export default AppNavigator;