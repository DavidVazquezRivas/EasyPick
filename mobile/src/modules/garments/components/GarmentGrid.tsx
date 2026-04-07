import { FlatList, View } from 'react-native';
import { SimpleGarment } from '@/core/api/garment/models/SimpleGarment'
import { GarmentCard } from './GarmentCard';

interface GarmentGridProps {
  garments: SimpleGarment[];
}

export const GarmentGrid = ({ garments }: GarmentGridProps) => {
  return (
    <FlatList
      data={garments}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 6 }}
      renderItem={({ item }) => <GarmentCard garment={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};