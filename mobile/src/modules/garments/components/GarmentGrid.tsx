import { FlatList, View } from 'react-native';
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { GarmentCard } from './GarmentCard';
import { Text } from '@/shared/components/ui';

interface GarmentGridProps {
  garments: SimpleGarment[];
  emptyMessage?: string;
}

export const GarmentGrid = ({ garments, emptyMessage }: GarmentGridProps) => {
  return (
    <FlatList
      data={garments}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 8, paddingBottom: 6 }}
      renderItem={({ item }) => <GarmentCard garment={item} />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center px-6 py-12">
          <Text className="text-center text-base text-muted-foreground">
            {emptyMessage || 'No se encontraron resultados'}
          </Text>
        </View>
      )}
    />
  );
};