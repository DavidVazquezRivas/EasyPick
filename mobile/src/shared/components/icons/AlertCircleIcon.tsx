import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';
import { getThemeColor } from '@/core/theme/themeColors';
import { useColorScheme } from 'react-native';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const AlertCircleIcon = ({
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
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 8v4" />
      <Path d="M12 16h.01" />
    </Svg>
  );
};

export default AlertCircleIcon;
