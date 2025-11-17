import React, { useState, useEffect, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
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

    const darkStatusBar = (
        <StatusBar barStyle="light-content" backgroundColor="#181f01" />
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                {darkStatusBar}
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (!character) {
        return (
            <View style={styles.loadingContainer}>
                {darkStatusBar}
                <Text style={styles.loadingText}>Personagem não encontrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.screenContainer}>
            
            {darkStatusBar}
            
            <ScrollView 
                style={styles.contentScroll} 
                contentContainerStyle={[styles.scrollContentContainer, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.cardContainer}>
                    
                    <Image source={{ uri: character.image }} style={styles.largeImage} />
                    
                    <View style={styles.nameContainer}>
                         <Text style={styles.name}>{character.name}</Text>
                    </View>

                    <View style={styles.detailsSection}>
                        <Text style={styles.header}>Basic Informations</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Status:</Text> {character.status}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Species:</Text> {character.species}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Gender:</Text> {character.gender}</Text>
                        
                        <Text style={styles.header}>Location</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Origin:</Text> {character.origin.name}</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Current Location:</Text> {character.location.name}</Text>
                    </View>
                </View>
                
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#181f01',
    },
    contentScroll: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardContainer: {
        width: '95%',
        maxWidth: 400, 
        backgroundColor: '#2c3e50', 
        borderRadius: 15,
        borderWidth: 10,
        borderColor: '#1a7a18',
        paddingBottom: 20, 
        alignItems: 'center',
        
        shadowColor: '#30e02d', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 8, 
    },
    
    nameContainer: {
        width: '100%',
        backgroundColor: '#1a7a18', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 15, 
    },
    
    detailsSection: {
        width: '100%',
        paddingHorizontal: 20, 
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181f01',
    },
    loadingText: {
        fontSize: 16,
        color: '#ffffff', 
        marginTop: 10,
        textAlign: 'center',
    },
    largeImage: {
        width: '100%',
        height: 333,
        marginBottom: 0,
        borderRadius: 5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0, 
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff', 
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 15,
        marginBottom: 5,
        alignSelf: 'flex-start',
        color: '#ffffff', 
        borderBottomWidth: 1,
        borderBottomColor: '#25b52255',
        paddingBottom: 2,
        width: '100%',
    },
    label: {
        fontWeight: 'bold',
        color: '#25b522',
    },
    detailText: {
        fontSize: 16,
        color: '#ffffff', 
        marginBottom: 5,
        alignSelf: 'flex-start',
        width: '100%',
    },
});

export default CharacterDetailScreen;