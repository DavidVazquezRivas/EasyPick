import React from 'react';
import Svg, { Path, Line, SvgProps } from 'react-native-svg';
import { getThemeColor } from '@/core/theme/themeColors';
import { useColorScheme } from 'react-native';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const ShoppingBagIcon = ({
  size = 24,
  color,
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const colorScheme = useColorScheme();
  const defaultColor = getThemeColor('foreground', colorScheme);
  const resolvedColor = color ?? defaultColor;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={resolvedColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <Line x1="3" y1="6" x2="21" y2="6" />
      <Path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
};

export default ShoppingBagIcon;
