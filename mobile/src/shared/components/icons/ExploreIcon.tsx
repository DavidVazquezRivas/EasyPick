import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { getThemeColor } from '@/core/theme/themeColors';
import { useColorScheme } from 'react-native';


const ExploreIcon = ({ size = 24, color, strokeWidth = 1.8, ...props }: any) => {
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
    <Circle cx="11" cy="11" r="8" />
    < Path d="m21 21-4.3-4.3" />
  </Svg>
  );
};

export default ExploreIcon;