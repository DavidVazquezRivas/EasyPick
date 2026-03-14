import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useAuth } from '@/core/auth/AuthContext'
import { useGetMyGarments } from '@/core/query/garment'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'

export const HomePage = () => {
  const { signOut } = useAuth()
  const { data, isLoading, isError, error } = useGetMyGarments()

  return (
    <ScrollView className='flex-1 bg-background'>
      <View className='mx-4 my-8 gap-4'>
        <Text variant='h2'>My Garments</Text>

        <Card>
          <CardHeader>
            <Text variant='large'>API state</Text>
          </CardHeader>

          <CardContent>
            {isLoading && <ActivityIndicator size='large' color='#795548' />}

            {isError && <Text className='text-destructive'>Error: {error.message}</Text>}

            {data && <Text className='text-muted-foreground'>{JSON.stringify(data, null, 2)}</Text>}
          </CardContent>
        </Card>

        <Button variant='destructive' onPress={signOut}>
          Sign Out
        </Button>
      </View>
    </ScrollView>
  )
}
