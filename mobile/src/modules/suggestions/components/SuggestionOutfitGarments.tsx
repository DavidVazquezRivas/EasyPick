import { View, Image, ScrollView } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import CloseIcon from '@/shared/components/icons/CloseIcon'
import type { SuggestedGarment } from '@/core/api/suggestion'
import { useTranslation } from 'react-i18next'

type SuggestionOutfitGarmentsProps = {
    garments: SuggestedGarment[]
    onClose: () => void
}

export const SuggestionOutfitGarments = ({ garments, onClose }: SuggestionOutfitGarmentsProps) => {
    const { t } = useTranslation()
    return (
        <Card className='absolute bottom-[10px] mx-6 z-50 flex-col overflow-hidden rounded-[28px] p-0 gap-0 border-0 shadow-lg shadow-black/20'>
            <View className='flex-col items-center border-b border-border pb-3 pt-2.5'>
                <View className='mb-3 h-1 w-9 rounded-full bg-muted-foreground/30' />
                <View className='w-full flex-row items-center justify-between px-4'>
                    <Text className='text-sm font-bold text-foreground'>{t('common.suggestions.outfitGarments')}</Text>
                    <Button
                        variant='ghost'
                        size='icon'
                        onPress={onClose}
                        className='h-8 w-8 rounded-full bg-muted'>
                        <CloseIcon size={16} />
                    </Button>
                </View>
            </View>

            <View className='flex-1 px-4 py-3'>
                {garments.map((garment) => (
                    <View key={garment.id} className='flex-row items-center gap-3 rounded-[14px] bg-muted px-3 py-2.5 mb-2'>
                        <View className='h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white'>
                            {garment.imageUrl ? (
                                <Image source={{ uri: garment.imageUrl }} className='h-full w-full' resizeMode='cover' />
                            ) : null}
                        </View>
                        <View className='flex-1'>
                            <Text className='text-[13px] font-semibold text-foreground' numberOfLines={1}>
                                {garment.name}
                            </Text>
                            <Text className='text-[11px] text-muted-foreground' numberOfLines={1}>
                                {garment.category?.name ?? 'Categoría'} {garment.brand ? `· ${garment.brand}` : ''}
                            </Text>
                        </View>
                        <View className='shrink-0 flex-row gap-[3px]'>
                            <View
                                className='h-2.5 w-2.5 rounded-full border border-border'
                                style={{ backgroundColor: garment.colors?.[0]?.hexCode ?? 'black' }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </Card>
    )
}
