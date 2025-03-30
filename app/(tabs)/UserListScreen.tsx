import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { API_URL } from '@env';

interface User {
  id: number;
  name: string;
  anrede: string;
  betreff: string;
  company: string;
}

export default function UserListScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      const res = await axios.get<{ success: boolean; users: User[] }>(
        `${API_URL}/api/users`
      );
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error('❌ Fehler beim Laden der Nutzer:', err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  const deleteUser = (id: number) => {
    Alert.alert(
      'Löschen bestätigen',
      'Willst du diesen Nutzer wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/api/user/${id}`);
              setUsers((prev) => prev.filter((user) => user.id !== id));
            } catch (err) {
              console.error('Fehler beim Löschen:', err);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userBox}
      onLongPress={() => deleteUser(item.id)}
      onPress={() =>
        router.push({
          pathname: '/UserDetail',
          params: { userId: String(item.id) },
        })
      }
    >
      <Text style={styles.name}>
        {item.anrede} {item.name}
      </Text>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.small}>{item.betreff}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Nutzerliste</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Keine Nutzer gefunden.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 50 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  userBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  company: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  small: { fontSize: 14, color: '#555' },
});
