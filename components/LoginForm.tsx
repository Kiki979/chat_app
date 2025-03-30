import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

export default function LoginForm() {
  const [name, setName] = useState('');
  const [unternehmen, setUnternehmen] = useState('');
  const [meldung, setMeldung] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/login`, {
        name,
        unternehmen,
      });

      if (res.data.success && res.data.userId === 0) {
        setMeldung('✅ Admin eingeloggt');
      } else {
        setMeldung('❌ Zugangsdaten ungültig');
      }
    } catch (error) {
      setMeldung('❌ Fehler beim Login');
    }
  };

  return (
    <View>
      <Text>Admin-Login</Text>
      <TextInput placeholder='Name' value={name} onChangeText={setName} />
      <TextInput
        placeholder='Unternehmen'
        value={unternehmen}
        onChangeText={setUnternehmen}
      />
      <Button title='Login' onPress={handleLogin} />
      {meldung ? <Text>{meldung}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
});
