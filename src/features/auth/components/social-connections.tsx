import { Apple, Chrome, Github } from 'lucide-react-native';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const SOCIAL_CONNECTIONS = [
  { id: 'apple', icon: Apple },
  { id: 'google', icon: Chrome },
  { id: 'github', icon: Github },
];

export function SocialConnections() {
  // Get foreground color for icons
  const iconColor = useThemeColor({}, 'foreground');

  return (
    <View style={styles.container}>
      {SOCIAL_CONNECTIONS.map((connection) => (
        <Button key={connection.id} variant="outline" size="sm" style={styles.button}>
          <Icon as={connection.icon} size={20} color={iconColor} />
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    minWidth: 80,
  },
});
