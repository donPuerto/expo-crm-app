import { Apple, Chrome, Github } from '@tamagui/lucide-icons';
import { XStack, Button } from '@/interface/primitives';

const SOCIAL_CONNECTIONS = [
  { id: 'apple', icon: Apple },
  { id: 'google', icon: Chrome },
  { id: 'github', icon: Github },
];

export function SocialConnections() {
  return (
    <XStack gap="$3" justifyContent="center">
      {SOCIAL_CONNECTIONS.map(connection => (
        <Button
          key={connection.id}
          variant="outlined"
          size="$3"
          icon={connection.icon}
          flex={1}
          minWidth={80}
        />
      ))}
    </XStack>
  );
}
