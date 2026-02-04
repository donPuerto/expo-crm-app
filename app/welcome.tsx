import React from 'react';
import { useRouter } from 'expo-router';

import {
  BarChart3,
  Button,
  Card,
  Paragraph,
  ScrollView,
  Separator,
  Text,
  Users,
  XStack,
  YStack,
  Zap,
  useTheme,
} from '@/interface/primitives';

function FeatureRow({
  Icon,
  title,
  description,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
}) {
  const theme = useTheme();
  const iconColor = theme.primary.get();

  return (
    <Card padding="$4" backgroundColor="$card" borderWidth={1} borderColor="$borderColor">
      <XStack gap="$3" alignItems="center">
        <YStack
          width={48}
          height={48}
          borderRadius="$4"
          alignItems="center"
          justifyContent="center"
          backgroundColor="$secondary"
        >
          <Icon size={22} color={iconColor} />
        </YStack>

        <YStack flex={1} gap="$1">
          <Text fontSize="$5" fontWeight="700" color="$color">
            {title}
          </Text>
          <Paragraph color="$mutedForeground">{description}</Paragraph>
        </YStack>
      </XStack>
    </Card>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView flex={1} backgroundColor="$background" contentContainerStyle={{ flexGrow: 1 }}>
      <YStack flex={1} padding="$6" paddingTop="$10" paddingBottom="$8" gap="$6">
        <YStack alignItems="center" gap="$2">
          <Text fontSize="$8" fontWeight="800" textAlign="center" color="$color">
            Welcome to your
          </Text>
          <Text fontSize="$8" fontWeight="800" textAlign="center" color="$primary">
            Application
          </Text>
        </YStack>

        <YStack gap="$3">
          <FeatureRow
            Icon={BarChart3}
            title="Real-time Analytics"
            description="Track your business performance"
          />
          <FeatureRow
            Icon={Users}
            title="Customer Management"
            description="Organize all your contacts"
          />
          <FeatureRow Icon={Zap} title="Smart Automation" description="Save time with workflows" />
        </YStack>

        <Button
          size="$5"
          backgroundColor="$primary"
          borderColor="$primary"
          onPress={() => router.push('/(tabs)/' as never)}
        >
          <Text color="$primaryForeground">Continue</Text>
        </Button>

        <Separator opacity={0.35} />

        <YStack alignItems="center" gap="$2">
          <Text fontSize="$2" color="$mutedForeground" textAlign="center">
            By pressing continue, you agree to our
          </Text>

          <XStack gap="$3">
            <Text
              fontSize="$2"
              fontWeight="700"
              color="$primary"
              textDecorationLine="underline"
              onPress={() => router.push('/terms' as never)}
            >
              Terms of Service
            </Text>

            <Text
              fontSize="$2"
              fontWeight="700"
              color="$primary"
              textDecorationLine="underline"
              onPress={() => router.push('/policy' as never)}
            >
              Privacy Policy
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
