import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Scene = {
  id: string;
  description: string;
  cost: string;
  stock: string;
};

const initialScenes: Scene[] = [
  { id: '1', description: 'Scene 1', cost: 'Parte interesante', stock: 'Involucrados' },
  { id: '2', description: 'Scene 2', cost: 'Parte interesante', stock: 'Involucrados' },
  { id: '3', description: 'Scene 3', cost: 'Parte interesante', stock: 'Involucrados' },
];

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScene: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedCost, setEditedCost] = useState('');
  const [editedStock, setEditedStock] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (scene: Scene) => {
    setCurrentScene(scene);
    setEditedDescription(scene.description);
    setEditedCost(scene.cost);
    setEditedStock(scene.stock);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newScenes = scenes.filter(scene => scene.id !== id);
    setScenes(newScenes);
  };

  const handleSave = () => {
    if (isEditing && currentScene) {
      const updatedScene: Scene = {
        ...currentScene,
        description: editedDescription,
        cost: editedCost,
        stock: editedStock,
      };
      const updatedScenes = scenes.map(scene =>
        scene.id === currentScene.id ? updatedScene : scene
      );
      setScenes(updatedScenes);
    } else {
      const newScene: Scene = {
        id: (scenes.length + 1).toString(),
        description: editedDescription,
        cost: editedCost,
        stock: editedStock,
      };
      setScenes([...scenes, newScene]);
    }
    setModalVisible(false);
    setCurrentScene(null);
    setEditedDescription('');
    setEditedCost('');
    setEditedStock('');
    setIsEditing(false);
  };

  const renderItem = ({ item }: { item: Scene }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Characters')}>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.description}</Text>
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
    setCurrentScene(null);
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
        <Text style={styles.header}>FILM 1</Text>
      </View>
      <Text style={styles.subHeader}>SCENES</Text>
      <FlatList
        data={scenes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentScene(null);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{isEditing ? 'Editar Escena' : 'Agregar Escena'}</Text>
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
  subHeader: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
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

export default DashboardScene;
