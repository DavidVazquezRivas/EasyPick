import { Ionicons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'
import { Text } from '@/shared/components/ui'

type GarmentDetailActionsProps = {
  isEditing: boolean
  isSaving: boolean
  canSave: boolean
  sectionTitle: string
  deleteLabel: string
  editLabel: string
  cancelLabel: string
  saveLabel: string
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

export const GarmentDetailActions = ({
  isEditing,
  isSaving,
  canSave,
  sectionTitle,
  deleteLabel,
  editLabel,
  cancelLabel,
  saveLabel,
  onEdit,
  onCancel,
  onSave,
}: GarmentDetailActionsProps) => {
  return (
    <View className='flex-row items-start justify-between'>
      <Text className='max-w-[45%] text-xxs font-semibold uppercase tracking-[1.8px] text-muted-foreground'>{sectionTitle}</Text>

      {!isEditing ? (
        <View className='flex-row gap-2'>
          <Pressable className='flex-row items-center gap-1.5 rounded-full bg-destructive-subtle px-4 py-2'>
            <Ionicons name='trash-outline' size={14} color='#DC2626' />
            <Text className='text-sm font-medium text-destructive'>{deleteLabel}</Text>
          </Pressable>

          <Pressable className='flex-row items-center gap-1.5 rounded-full bg-accent px-4 py-2' onPress={onEdit}>
            <Ionicons name='pencil-outline' size={14} color='#5D4037' />
            <Text className='text-sm font-medium text-foreground'>{editLabel}</Text>
          </Pressable>
        </View>
      ) : (
        <View className='flex-row gap-2'>
          <Pressable
            className='flex-row items-center gap-1.5 rounded-full bg-accent px-4 py-2'
            onPress={onCancel}
            disabled={isSaving}>
            <Ionicons name='close-outline' size={16} color='#6B7280' />
            <Text className='text-sm font-medium text-muted-foreground'>{cancelLabel}</Text>
          </Pressable>

          <Pressable
            className='flex-row items-center gap-1.5 rounded-full bg-foreground px-4 py-2'
            onPress={onSave}
            disabled={isSaving || !canSave}>
            <Ionicons name='checkmark-outline' size={16} color='#FFFFFF' />
            <Text className='text-sm font-semibold text-card'>{saveLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
