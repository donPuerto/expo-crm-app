import * as React from 'react';
import { View, Image, StyleSheet, type ViewStyle, type ImageSourcePropType } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFont } from '@/hooks/use-font';

interface AvatarProps {
  source?: ImageSourcePropType;
  fallback?: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ source, fallback, size = 40, style }: AvatarProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const { fontFamily } = useFont();

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  // Get initials from fallback text
  const getInitials = (text?: string) => {
    if (!text) return '?';
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.container, avatarStyle, style]}>
      {source ? (
        <Image source={source} style={[styles.image, avatarStyle]} />
      ) : (
        <View style={[styles.fallback, avatarStyle, { backgroundColor }]}>
          <Text
            variant="default"
            style={[styles.fallbackText, { fontFamily, fontSize: size * 0.4, color: '#ffffff' }]}
          >
            {getInitials(fallback)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontWeight: 'bold',
  },
});
