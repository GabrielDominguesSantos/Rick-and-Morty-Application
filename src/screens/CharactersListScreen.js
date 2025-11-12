import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';

const API_URL = 'https://rickandmortyapi.com/api/character';

const CharactersListScreen = ({ navigation }) => {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ marginTop: 10 }}>Carregando...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
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
        backgroundColor: '#fff', 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CharactersListScreen;