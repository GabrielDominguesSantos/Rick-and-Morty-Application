import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

const CharacterCard = ({ character, onPress }) => {
    const getStatusStyle = (status) => {
        switch (status) {
        case 'Alive':
            return { backgroundColor: 'green' };
        case 'Dead':
            return { backgroundColor: 'red' };
        default:
            return { backgroundColor: 'gray' };
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(character.id)}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{character.name}</Text>
            <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, getStatusStyle(character.status)]} />
            <Text style={styles.statusText}>
                {character.status} - {character.species}
            </Text>
            </View>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginVertical: 5,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#29c926',
        borderRadius: 5,
        padding: 5,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    infoContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#eee',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#eee',
    },
});

export default CharacterCard;