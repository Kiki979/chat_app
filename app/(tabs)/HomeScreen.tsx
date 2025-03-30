import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>Nadine</Text>
        <Text style={styles.surname}>Kickhäfer</Text>
      </View>

      <Animated.Image
        source={require('@/assets/images/bewerbungsfoto_nadine_kickhaefer.jpg')}
        style={styles.profileImage}
        resizeMode='cover'
      />

      <View style={styles.content}>
        <Text style={styles.description}>
          Ich bin Nadine Kickhäfer und Web Developer mit Leib und Seele
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  nameContainer: {
    width: '400',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 40,
    fontFamily: 'serif',
    fontWeight: '600',
  },
  surname: {
    width: '300',
    fontSize: 36,
    color: '#7d7d7d',
    paddingLeft: 20,
  },

  profileImage: {
    width: screenWidth > 768 ? 260 : 180,
    height: screenWidth > 768 ? 260 : 180,
    borderRadius: 130,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: screenWidth > 768 ? 24 : 18,
    color: '#2c3e50',
    textAlign: 'center',
    maxWidth: 600,
    marginVertical: 20,
  },
});
