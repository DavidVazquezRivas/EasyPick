import * as React from 'react'
import { Pressable, View } from 'react-native'
import { cn } from '@/shared/utils/tailwind.utils'

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Switch = React.forwardRef<React.ElementRef<typeof Pressable>, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    const switchColor = checked ? 'bg-[#52b788]' : 'bg-[#e57373]';
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={() => onCheckedChange(!checked)}
        role="switch"
        accessibilityState={{ checked }}
        className={cn(
          'w-11 h-6 rounded-full ' + switchColor,
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        <View
          className={cn(
            'w-5 h-5 bg-white rounded-full mt-0.5 transition-transform duration-200',
            checked ? 'ml-5' : 'ml-1'
          )}
        />
      </Pressable>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
