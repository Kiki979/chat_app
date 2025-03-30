import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';

import { API_URL } from '@env';

export default function CreateUserScreen(): JSX.Element {
  const [name, setName] = useState('');
  const [anrede, setAnrede] = useState('');
  const [betreff, setBetreff] = useState('');
  const [unternehmen, setUnternehmen] = useState('');
  const [anschreiben, setAnschreiben] = useState('');
  const [meldung, setMeldung] = useState('');
  const [startMessage, setStartMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !anrede || !betreff || !unternehmen || !anschreiben) {
      setMeldung('⚠️ Bitte alle Felder ausfüllen.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/createUser`, {
        name,
        anrede,
        betreff,
        unternehmen,
        anschreiben,
        startMessage,
      });

      if (res.data.success && res.data.id) {
        setMeldung(`✅ Benutzer erstellt (ID: ${res.data.id})`);
        setName('');
        setAnrede('');
        setBetreff('');
        setUnternehmen('');
        setAnschreiben('');
        setStartMessage('');
      } else {
        setMeldung('❌ Fehler beim Erstellen.');
      }
    } catch (err) {
      setMeldung('❌ Netzwerkfehler beim Erstellen.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧑‍💼 Neuen Benutzer anlegen</Text>

      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder='Anrede (z. B. Herr/Frau)'
        value={anrede}
        onChangeText={setAnrede}
        style={styles.input}
      />
      <TextInput
        placeholder='Betreff'
        value={betreff}
        onChangeText={setBetreff}
        style={styles.input}
      />
      <TextInput
        placeholder='Unternehmen'
        value={unternehmen}
        onChangeText={setUnternehmen}
        style={styles.input}
      />
      <TextInput
        placeholder='Anschreiben'
        value={anschreiben}
        onChangeText={setAnschreiben}
        multiline
        style={[styles.input, styles.multiline]}
      />
      <TextInput
        placeholder='Erste Nachricht (optional)'
        value={startMessage}
        onChangeText={setStartMessage}
        multiline
        style={[styles.input, styles.multiline]}
      />

      <Button title='Benutzer erstellen' onPress={handleSubmit} />
      {meldung ? <Text style={styles.meldung}>{meldung}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  meldung: {
    marginTop: 10,
    fontSize: 14,
  },
});
