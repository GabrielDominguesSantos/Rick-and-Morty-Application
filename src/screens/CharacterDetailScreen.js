import React, { useState, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const CharacterDetailScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const { characterId } = route.params; 
    const [character, setCharacter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCharacterDetails = useCallback(async () => {
        try {
            const API_DETAIL_URL = `https://rickandmortyapi.com/api/character/${characterId}`;
            const response = await axios.get(API_DETAIL_URL);
            setCharacter(response.data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do personagem:', error);
            } finally {
                setIsLoading(false);
        }
    }, [characterId]);

    useEffect(() => {
        fetchCharacterDetails();
    }, [fetchCharacterDetails]);

    if (isLoading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={{ marginTop: 10 }}>Carregando detalhes...</Text>
        </View>
        );
    }

    if (!character) {
        return (
        <View style={styles.loadingContainer}>
            <Text>Personagem não encontrado.</Text>
        </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
        <Image source={{ uri: character.image }} style={styles.largeImage} />
        
        <Text style={styles.name}>{character.name}</Text>

        <Text style={styles.header}>Basic Informations</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Status:</Text> {character.status}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Species:</Text> {character.species}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Gender:</Text> {character.gender}</Text>
        
        <Text style={styles.header}>Location</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Origin:</Text> {character.origin.name}</Text>
        <Text style={styles.detailText}><Text style={styles.label}>Current Location:</Text> {character.location.name}</Text>
        
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    largeImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    label: {
        fontWeight: 'bold',
    },
    detailText: {
        fontSize: 14,
        marginBottom: 3,
        alignSelf: 'flex-start',
    },
});

export default CharacterDetailScreen;