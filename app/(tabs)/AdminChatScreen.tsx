import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';

import { API_URL } from '@env';

interface Message {
  id: number;
  text: string;
  senderRole: 'admin' | 'user' | string;
}

interface User {
  id: number;
  name: string;
}

export default function AdminChatScreen(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        try {
          const res = await axios.get<{ success: boolean; users: User[] }>(
            `${API_URL}/api/users`
          );
          if (res.data.success) {
            setUsers(res.data.users);
          }
        } catch (err) {
          console.error('❌ Fehler beim Laden der Benutzer:', err);
        }
      };

      fetchUsers();
    }, [])
  );

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedUser || !socketRef.current) return;

    const socket = socketRef.current;
    socket.emit('userConnected', { userId: selectedUser });

    socket.on('chatHistorie', (oldMessages: Message[]) => {
      setMessages(oldMessages);
    });

    socket.on('neueNachricht', ({ userId: msgUserId, message }) => {
      if (parseInt(msgUserId) === selectedUser) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('chatHistorie');
      socket.off('neueNachricht');
    };
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get<{ success: boolean; messages: Message[] }>(
          `${API_URL}/api/messages/${selectedUser}`
        );
        if (res.data.success) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('❌ Fehler beim Laden der Nachrichten:', err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedUser || !socketRef.current) return;

    const newMessage = {
      message: messageText,
      userId: selectedUser,
      senderRole: 'admin',
    };

    socketRef.current.emit('chatNachricht', JSON.stringify(newMessage));
    setMessageText('');
  };

  const deleteMessage = (id: number) => {
    Alert.alert('Nachricht löschen', 'Willst du diese Nachricht löschen?', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/message/${id}`);
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
          } catch (err) {
            console.error('Fehler beim Löschen:', err);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Chat</Text>

      {/* Benutzer Dropdown */}
      <View style={styles.dropdown}>
        <Picker
          selectedValue={selectedUser}
          onValueChange={(value) => setSelectedUser(value)}
          style={styles.picker}
        >
          <Picker.Item label='Wähle einen Benutzer' value={null} />
          {users.map((user) => (
            <Picker.Item key={user.id} label={user.name} value={user.id} />
          ))}
        </Picker>
      </View>

      {/* Nachrichten */}
      <ScrollView
        style={styles.chatBox}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => (
          <TouchableOpacity
            key={msg.id}
            onLongPress={() => deleteMessage(msg.id)}
            delayLongPress={500}
            style={[
              styles.messageBubble,
              msg.senderRole === 'admin'
                ? styles.adminMessage
                : styles.userMessage,
            ]}
          >
            <View style={styles.messageRow}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(
                  (msg as any).timestamp ?? Date.now()
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nachricht schreiben */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputField}
          placeholder='Nachricht schreiben...'
          value={messageText}
          onChangeText={setMessageText}
          multiline
          numberOfLines={1}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
          returnKeyType='send'
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!messageText.trim() || !selectedUser}
          style={[
            styles.sendButton,
            (!messageText.trim() || !selectedUser) && styles.sendButtonDisabled,
          ]}
        >
          <Text style={styles.sendButtonText}>Senden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  chatBox: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    flexShrink: 1,
    flexGrow: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  messageContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  timestampRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  timestamp: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#888',
    marginTop: 6,
    marginRight: 8,
  },

  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d6d0c8',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexShrink: 1,
    gap: 6,
    width: '80%',
    flexWrap: 'wrap',
  },
  messageText: {
    flexShrink: 1,
    flexGrow: 1,
    color: '#000',
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    maxHeight: 120,
    textAlignVertical: 'top',
  },

  sendButton: {
    backgroundColor: '#d6d0c8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
