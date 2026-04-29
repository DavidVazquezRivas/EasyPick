import { getThemeColor } from '@/core/theme/themeColors';
import React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface IconProps extends SvgProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}


const NotificationIcon = ({
    size = 24,
    color,
    strokeWidth = 1.8,
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
        <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <Path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </Svg>
    );
};

export default NotificationIcon;