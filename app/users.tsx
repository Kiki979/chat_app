import { useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function Users({ item }) {
  const router = useRouter();

  const handlePress = (id: number) => {
    router.push({
      pathname: '/UserDetail',
      params: { userId: id.toString() },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
}
