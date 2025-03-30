import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@env';

export default function UserDetailScreen() {
  const { userId } = useLocalSearchParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getData/${userId}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!data) return <Text>Lade Nutzerdaten...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.sub}>{data.company}</Text>

      <Text style={styles.titleText}>
        {data.anrede} {data.name}
      </Text>

      <Text style={styles.label}>Betreff:</Text>
      <Text style={styles.titleText}>{data.betreff}</Text>

      <Text style={styles.label}>Anschreiben:</Text>
      <Text>{data.message.replace(/<br>/g, '\n')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titleText: { fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#666', marginBottom: 10 },
  label: { marginTop: 10, fontWeight: 'bold' },
});
