import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';
import { useFonts } from 'expo-font';

const API_URL = 'https://rickandmortyapi.com/api/character';

const BORDER_OFFSET = 1.5; 
const FONT_SIZE = 60; 

const outlineBase = {
    fontFamily: "RickAndMortyFont", 
    fontSize: FONT_SIZE, 
    textAlign: 'center',
    color: '#80FF00', 
    position: 'absolute',
    zIndex: 1, 
    textShadowColor: '#80FF00', 
    textShadowRadius: 5,
    width: '100%', 
};

const CharactersListScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [fontsLoaded] = useFonts({
        'RickAndMortyFont': require('../../assets/fonts/RickAndMorty.ttf'), 
    });

    const fetchCharacters = useCallback(async () => {
        try {
            const response = await axios.get(API_URL);
            setCharacters(response.data.results);
        } catch (error) {
            console.error('Erro ao buscar personagens:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCharacters();
    }, [fetchCharacters]);

    const handleCardPress = (characterId) => {
        navigation.navigate('CharacterDetail', { characterId });
    };

    if (isLoading || !fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000000" />
                <Text style={{ marginTop: 10 }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            <View style={styles.titleContainer}>
                <Text style={styles.outlineText_TL}>Character List</Text>
                <Text style={styles.outlineText_TR}>Character List</Text>
                <Text style={styles.outlineText_BL}>Character List</Text>
                <Text style={styles.outlineText_BR}>Character List</Text>
                <Text style={styles.titleText}>Character List</Text>     
            </View>

            <FlatList
                data={characters}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CharacterCard character={item} onPress={handleCardPress} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181f01',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        height: FONT_SIZE * 1.2,
        overflow: 'visible',
    },
    titleText: {
        fontFamily: "RickAndMortyFont", 
        fontSize: FONT_SIZE, 
        textAlign: 'center',
        color: '#20A4F3', 
        position: 'absolute', 
        zIndex: 5,
        width: '100%',
    },
    outlineText_TL: {
        ...outlineBase,
        top: -BORDER_OFFSET,
        left: -BORDER_OFFSET,
    },
    outlineText_TR: {
        ...outlineBase, 
        top: -BORDER_OFFSET,
        left: BORDER_OFFSET,
    },
    outlineText_BL: {
        ...outlineBase,
        top: BORDER_OFFSET,
        left: -BORDER_OFFSET,
    },
    outlineText_BR: {
        ...outlineBase,
        top: BORDER_OFFSET,
        left: BORDER_OFFSET,
    },
});

export default CharactersListScreen;