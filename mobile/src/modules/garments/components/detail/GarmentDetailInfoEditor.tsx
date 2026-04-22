import { Pressable, TextInput, View } from 'react-native'
import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'
import { Text } from '@/shared/components/ui'

type GarmentDetailInfoEditorProps = {
  nameLabel: string
  categoryLabel: string
  colorLabel: string
  styleLabel: string
  brandLabel: string
  noNamePlaceholder: string
  draftName: string
  draftCategoryId: string
  draftStyleId: string
  draftBrandId: string
  draftColorIds: string[]
  categories: ConfigItem[]
  styles: ConfigItem[]
  colors: ConfigItem[]
  brands: ConfigItem[]
  onDraftNameChange: (name: string) => void
  onDraftCategoryChange: (id: string) => void
  onDraftStyleChange: (id: string) => void
  onDraftBrandChange: (id: string) => void
  onDraftColorToggle: (id: string) => void
  getChipStyle: (isSelected: boolean) => {
    borderWidth: number
    borderColor: string
    backgroundColor: string
    borderRadius: number
    paddingHorizontal: number
    paddingVertical: number
  }
  getOptionColorHex: (option: ConfigItem) => string
}

export const GarmentDetailInfoEditor = ({
  nameLabel,
  categoryLabel,
  colorLabel,
  styleLabel,
  brandLabel,
  noNamePlaceholder,
  draftName,
  draftCategoryId,
  draftStyleId,
  draftBrandId,
  draftColorIds,
  categories,
  styles,
  colors,
  brands,
  onDraftNameChange,
  onDraftCategoryChange,
  onDraftStyleChange,
  onDraftBrandChange,
  onDraftColorToggle,
  getChipStyle,
  getOptionColorHex,
}: GarmentDetailInfoEditorProps) => {
  return (
    <>
      <View className='flex-row items-center justify-between border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{nameLabel}</Text>
        <View className='w-[57%] border-b border-icon-inactive pb-1'>
          <TextInput
            value={draftName}
            onChangeText={onDraftNameChange}
            className='text-right text-xl font-semibold text-foreground'
            placeholder={noNamePlaceholder}
            placeholderTextColor='#9CA3AF'
          />
        </View>
      </View>

      <View className='border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{categoryLabel}</Text>
        <View className='mt-3 flex-row flex-wrap gap-2'>
          {categories.map((option) => {
            const isSelected = option.id === draftCategoryId
            return (
              <Pressable key={option.id} style={getChipStyle(isSelected)} onPress={() => onDraftCategoryChange(option.id)}>
                <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {option.name}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View className='border-b border-border py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{colorLabel}</Text>
        <View className='mt-3 flex-row flex-wrap gap-2'>
          {colors.map((option) => {
            const isSelected = draftColorIds.includes(option.id)
            return (
              <Pressable
                key={option.id}
                style={getChipStyle(isSelected)}
                className='flex-row items-center gap-2'
                onPress={() => onDraftColorToggle(option.id)}>
                <View
                  className={`h-[16px] w-[16px] rounded-full border ${isSelected ? 'border-white/70' : 'border-black/10'}`}
                  style={{ backgroundColor: getOptionColorHex(option) }}
                />
                <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {option.name}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View className='py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{styleLabel}</Text>
        <View className='mt-3 flex-row flex-wrap gap-2'>
          {styles.map((option) => {
            const isSelected = option.id === draftStyleId
            return (
              <Pressable key={option.id} style={getChipStyle(isSelected)} onPress={() => onDraftStyleChange(option.id)}>
                <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {option.name}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View className='py-5'>
        <Text className='text-base font-regular text-muted-foreground'>{brandLabel}</Text>
        <View className='mt-3 flex-row flex-wrap gap-2'>
          {brands.map((option) => {
            const isSelected = option.id === draftBrandId
            return (
              <Pressable key={option.id} style={getChipStyle(isSelected)} onPress={() => onDraftBrandChange(option.id)}>
                <Text className={`text-sm font-medium ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {option.name}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </>
  )
}
