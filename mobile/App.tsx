import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handlePress = () => {
    Alert.alert(
      "¡Atención!",
      "Pronto la IA etiquetará hasta tus calcetines desparejados. 🧦✨"
    );
  };

  return (
    <View style={styles.container}>
      {/* Título de la App */}
      <Text style={styles.title}>👔 EasyPick 👗</Text>
      
      {/* Subtítulo épico */}
      <Text style={styles.subtitle}>Adiós a la silla llena de ropa.</Text>
      
      {/* Mensaje de supervivencia dev */}
      <View style={styles.card}>
        <Text style={styles.text}>
          Si estás leyendo esto en tu móvil, significa que sobreviviste a ngrok, Expo y los node_modules. 
          {'\n\n'}¡Eres oficialmente un hacker! 👨‍💻🎉
        </Text>
      </View>

      {/* Botón de prueba para la futura US-03 */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Digitalizar mi caos</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Un fondo clarito y moderno
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2C3E50',
    marginBottom: 5,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7F8C8D',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Sombra para Android
    marginBottom: 40,
    width: '100%',
  },
  text: {
    fontSize: 15,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FF6B6B', // Un color llamativo y amigable
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});