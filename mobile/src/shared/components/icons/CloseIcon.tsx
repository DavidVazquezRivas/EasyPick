import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { getThemeColor } from '@/core/theme/themeColors';
import { useColorScheme } from 'react-native';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const CloseIcon = ({
  size = 24,
  color,
  strokeWidth = 2.5,
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
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </Svg>
  );
};

export default CloseIcon;
