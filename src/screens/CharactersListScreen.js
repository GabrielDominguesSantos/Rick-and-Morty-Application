import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import CharacterCard from '../components/CharacterCard';
import { useFonts } from 'expo-font';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

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
    const [nextPageUrl, setNextPageUrl] = useState(API_BASE_URL);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSearch, setCurrentSearch] = useState('');
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [fontsLoaded] = useFonts({
        'RickAndMortyFont': require('../../assets/fonts/RickAndMorty.ttf'), 
    });

    const fetchCharacters = useCallback(async (url, isPagination = false) => {
        if (!url || (isPagination && !hasMore)) return;

        isPagination ? setIsFetchingMore(true) : setIsLoading(true);
        
        try {
            const response = await axios.get(url);
            const newCharacters = response.data.results;
            
            setCharacters(prevCharacters => 
                isPagination ? [...prevCharacters, ...newCharacters] : newCharacters
            );
            
            setNextPageUrl(response.data.info.next);
            setHasMore(!!response.data.info.next);

        } catch (error) {
            console.error('Erro ao buscar personagens:', error);
            if (!isPagination) {
                setCharacters([]);
                setHasMore(false); 
                setNextPageUrl(null);
            }
        } finally {
            isPagination ? setIsFetchingMore(false) : setIsLoading(false);
        }
    }, [hasMore]);

    const runSearch = useCallback(() => {
        Keyboard.dismiss();

        if (searchTerm === currentSearch && characters.length > 0 && !isLoading) return;

        setCurrentSearch(searchTerm.trim()); 
        
        const term = searchTerm.trim();
        const searchUrl = term 
            ? `${API_BASE_URL}?name=${term}` 
            : API_BASE_URL;

        setCharacters([]); 
        setHasMore(true); 
        fetchCharacters(searchUrl, false); 
    }, [searchTerm, currentSearch, characters.length, isLoading, fetchCharacters]);


    useEffect(() => {
        if (fontsLoaded && !currentSearch) {
            fetchCharacters(API_BASE_URL, false);
        }
    }, [fontsLoaded, fetchCharacters, currentSearch]); 


    const handleLoadMore = () => {
        if (!isFetchingMore && hasMore) {
            fetchCharacters(nextPageUrl, true);
        }
    };
    
    const handleCardPress = (characterId) => {
        navigation.navigate('CharacterDetail', { characterId });
    };
    
    const renderFooter = () => {
        if (!isFetchingMore) return null;
        return (
            <View style={styles.footerLoading}>
                <ActivityIndicator size="large" color="#80FF00" />
            </View>
        );
    };
    
    const resetSearch = () => {
        setSearchTerm('');
        setCurrentSearch('');
    };

    if (isLoading || !fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#181f01" /> 
                <ActivityIndicator size="large" color="#80FF00" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }
    
    if (characters.length === 0 && !isLoading) {
         return (
            <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
                <StatusBar barStyle="light-content" backgroundColor="#181f01" />
                <Text style={styles.noResultsText}>
                    {currentSearch 
                        ? `Nenhum personagem encontrado para "${currentSearch}".`
                        : "Não foi possível carregar os personagens."
                    }
                </Text>
                <TouchableOpacity onPress={resetSearch}>
                    <Text style={styles.resetSearchText}>Tentar Novamente / Limpar busca</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor="#181f01" />

            {/* TÍTULO */}
            <View style={styles.titleContainer}>
                <Text style={styles.outlineText_TL}>Character List</Text>
                <Text style={styles.outlineText_TR}>Character List</Text>
                <Text style={styles.outlineText_BL}>Character List</Text>
                <Text style={styles.outlineText_BR}>Character List</Text>
                <Text style={styles.titleText}>Character List</Text>     
            </View>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar personagem..."
                placeholderTextColor="#fff"
                value={searchTerm}
                onChangeText={setSearchTerm} 
                onSubmitEditing={runSearch} 
                returnKeyType="search"
            />
            
            <FlatList
                data={characters}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <CharacterCard character={item} onPress={handleCardPress} />
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} 
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
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
        backgroundColor: '#181f01',
    },
    loadingText: {
        marginTop: 10,
        color: '#ffffff',
        fontSize: 16,
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
    searchInput: {
        height: 45,
        backgroundColor: '#2c3e50',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#29c926',
        fontSize: 16,
        marginBottom: 15,
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    footerLoading: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#80FF0050',
    },
    noResultsText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
    },
    resetSearchText: {
        color: '#20A4F3',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});

export default CharactersListScreen;