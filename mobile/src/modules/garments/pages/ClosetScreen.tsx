import { View, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/ui'
import { GarmentGrid } from '../components/GarmentGrid'
import { useGetMyGarments } from '@/core/query/garment' // Importas el Hook (Paso 5)

export const ClosetScreen = () => {
  const { t } = useTranslation()

  // 1. Obtener los datos de la API de Spring Boot
  const { data: garments, isLoading, isError, refetch } = useGetMyGarments()

  // 2. Gestión de estado: Cargando
  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-background'>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  // 3. Gestión de estado: Error
  if (isError) {
    return (
      <View className='flex-1 items-center justify-center bg-background px-6'>
        <Text variant='h4' className='text-destructive'>Error al cargar</Text>
        <Text className='text-center mt-2'>No pudimos conectar con el servidor.</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-background pt-[10%]'>
      {/* Título de la pantalla */}
      <View className='px-6 pb-[5%]'>
        <Text className="text-5xl font-bold tracking-tight" style={{ color: 'rgb(28, 28, 28)' }}>
          Mi Armario
        </Text>
      </View>
      {/* 4. El Grid con los datos reales */}
      <GarmentGrid garments={garments ?? []} />
    </View>
  )
}
