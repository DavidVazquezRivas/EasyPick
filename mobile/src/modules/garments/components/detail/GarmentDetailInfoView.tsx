import { View } from 'react-native'
import { Text } from '@/shared/components/ui'

type GarmentDetailInfoViewProps = {
  nameFieldLabel: string
  categoryFieldLabel: string
  styleFieldLabel: string
  brandFieldLabel: string
  nameValue: string
  categoryValue: string
  styleValue: string
  brandValue: string
  colorFieldLabel: string
  displayedColorLabels: string[]
  shouldStackColors: boolean
  resolveColorHex: (name: string) => string
}

export const GarmentDetailInfoView = ({
  nameFieldLabel,
  categoryFieldLabel,
  styleFieldLabel,
  brandFieldLabel,
  nameValue,
  categoryValue,
  styleValue,
  brandValue,
  colorFieldLabel,
  displayedColorLabels,
  shouldStackColors,
  resolveColorHex,
}: GarmentDetailInfoViewProps) => {
  return (
    <>
      <View className='flex-row items-center justify-between border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{nameFieldLabel}</Text>
        <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{nameValue}</Text>
      </View>

      <View className='flex-row items-center justify-between border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{categoryFieldLabel}</Text>
        <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{categoryValue}</Text>
      </View>

      <View className='flex-row items-center justify-between border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{colorFieldLabel}</Text>
        <View className={shouldStackColors ? 'max-w-[60%] items-end gap-2' : 'flex-row max-w-[60%] flex-wrap justify-end gap-2'}>
          {displayedColorLabels.map((label, index) => (
            <View key={`${label}-${index}`} className='flex-row items-center gap-1.5 rounded-full bg-accent/30 px-2 py-1'>
              <View
                className='h-[12px] w-[12px] rounded-full border border-icon-inactive'
                style={{ backgroundColor: resolveColorHex(label) }}
              />
              <Text className='text-lg font-semibold text-primary'>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='flex-row items-center justify-between border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{styleFieldLabel}</Text>
        <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{styleValue}</Text>
      </View>

      <View className='flex-row items-center justify-between py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{brandFieldLabel}</Text>
        <Text className='max-w-[58%] text-right text-xl font-semibold text-primary'>{brandValue}</Text>
      </View>
    </>
  )
}
