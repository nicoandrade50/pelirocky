import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Index'>;

const IndexScreen: React.FC = () => {
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const [selectedMovie, setSelectedMovie] = useState<string>('Rocky I');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Puedes reemplazar esta lógica con una llamada real a una API de inicio de sesión
    if (username === 'user' && password === 'password') {
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🥊</Text>
      </View>
      <Text style={styles.title}>ROCKY FILMS</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.question}>¿Cuál es tu película favorita de Rocky?</Text>
        <Picker
          selectedValue={selectedMovie}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMovie(itemValue)}
        >
          <Picker.Item label="Rocky I" value="Rocky I" />
          <Picker.Item label="Rocky II" value="Rocky II" />
          <Picker.Item label="Rocky III" value="Rocky III" />
          <Picker.Item label="Rocky IV" value="Rocky IV" />
          <Picker.Item label="Rocky V" value="Rocky V" />
          <Picker.Item label="Rocky Balboa" value="Rocky Balboa" />
        </Picker>
      </View>
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.buttonText}>Punch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 100,
    color: '#ff5733',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 200,
    color: '#FFFFFF',
    backgroundColor: '#444444',
  },
  loginContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    borderBottomWidth: 1,
    color: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#c70039',
    paddingVertical: 0,
    borderRadius: 0,
  },
  loginButtonText: {
    fontSize: 0,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#c70039',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default IndexScreen;
