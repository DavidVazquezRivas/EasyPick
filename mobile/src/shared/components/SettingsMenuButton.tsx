import React, { useState } from 'react';
import { useColorScheme, Pressable, Dimensions } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { getThemeColor } from '@/core/theme/themeColors';
import { SettingsDropdown } from './SettingsDropdown';
import SettingsIcon from './icons/SettingsIcon';

export const SettingsMenuButton = () => {
    const [isSettingsOn, setSettingsOn] = useState(false);

    return (
        <>
            <Button
                onPress={() => setSettingsOn(!isSettingsOn)}
                variant="secondary"
                size="icon"
                className="active:scale-90 rounded-full"
            >
                <SettingsIcon />
            </Button>

            {isSettingsOn && (
                <>
                    <Pressable
                        className="absolute w-[3000px] h-[3000px] -top-[1000px] -right-[1000px] z-40 bg-transparent"
                        onPress={() => setSettingsOn(false)}
                    />
                    <SettingsDropdown />
                </>
            )}
        </>
    );
};
