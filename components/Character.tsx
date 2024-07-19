import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Character = {
  id: string;
  director: string;
  description: string;
  cost: string;
  stock: string;
};

const initialCharacters: Character[] = [
  { id: '1', director: 'Director 1', description: 'Rocky Balboa', cost: 'Luchador', stock: '' },
  { id: '2', director: 'Director 2', description: 'Apollo Creed', cost: 'Luchador', stock: '' },
  { id: '3', director: 'Director 3', description: 'Talia Shire', cost: 'Manager', stock: '' },
];

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardCharacter: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [editedDirector, setEditedDirector] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCost, setEditedCost] = useState('');
  const [editedStock, setEditedStock] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (character: Character) => {
    setCurrentCharacter(character);
    setEditedDirector(character.director);
    setEditedDescription(character.description);
    setEditedCost(character.cost);
    setEditedStock(character.stock);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newCharacters = characters.filter(character => character.id !== id);
    setCharacters(newCharacters);
  };

  const handleSave = () => {
    if (isEditing && currentCharacter) {
      const updatedCharacter: Character = {
        ...currentCharacter,
        director: editedDirector,
        description: editedDescription,
        cost: editedCost,
        stock: editedStock,
      };
      const updatedCharacters = characters.map(character =>
        character.id === currentCharacter.id ? updatedCharacter : character
      );
      setCharacters(updatedCharacters);
    } else {
      const newCharacter: Character = {
        id: (characters.length + 1).toString(),
        director: editedDirector,
        description: editedDescription,
        cost: editedCost,
        stock: editedStock,
      };
      setCharacters([...characters, newCharacter]);
    }
    setModalVisible(false);
    setCurrentCharacter(null);
    setEditedDirector('');
    setEditedDescription('');
    setEditedCost('');
    setEditedStock('');
    setIsEditing(false);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => handleEdit(item)}>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.description}</Text>
          <Text style={styles.cardSubtitle}>{item.director}</Text>
          <Text style={styles.cardSubtitle}>{item.cost}</Text>
          <Text style={styles.cardSubtitle}>{item.stock}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAdd = () => {
    setCurrentCharacter(null);
    setEditedDirector('');
    setEditedDescription('');
    setEditedCost('');
    setEditedStock('');
    setIsEditing(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Scene 1</Text>
      </View>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentCharacter(null);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{isEditing ? 'Editar Personaje' : 'Agregar Personaje'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Director"
            value={editedDirector}
            onChangeText={text => setEditedDirector(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={editedDescription}
            onChangeText={text => setEditedDescription(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Costo"
            value={editedCost}
            onChangeText={text => setEditedCost(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={editedStock}
            onChangeText={text => setEditedStock(text)}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'black',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#800F2F',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#800F2F',
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DashboardCharacter;
