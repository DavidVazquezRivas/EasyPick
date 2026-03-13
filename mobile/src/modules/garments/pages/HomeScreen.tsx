import { View, Text, Button, ActivityIndicator } from 'react-native'
import { useAuth } from '@/core/auth/AuthContext'
import { useGetMyGarments } from '@/core/query/garment'

export const HomePage = () => {
  const { signOut } = useAuth()
  const { data, isLoading, isError, error } = useGetMyGarments()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>My Garments</Text>

      {isLoading && <ActivityIndicator size='large' color='blue' />}

      {isError && <Text style={{ color: 'red', marginBottom: 20 }}>Error: {error.message}</Text>}

      {data && <Text style={{ marginBottom: 20 }}>{JSON.stringify(data, null, 2)}</Text>}

      <Button title='Sign Out' color='red' onPress={signOut} />
    </View>
  )
}
