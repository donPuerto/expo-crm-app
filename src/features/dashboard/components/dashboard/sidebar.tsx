import React, { useEffect } from 'react';
import { YStack, XStack, Text, ScrollView, useTheme } from 'tamagui';
import { Briefcase, Users, Settings, User, Inbox } from '@/interface/primitives';
import { usePathname, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Sales', href: '/(dashboards)/sales', Icon: Briefcase },
  { label: 'Users', href: '/(dashboards)/users', Icon: Users },
  { label: 'Admin', href: '/(dashboards)/admin', Icon: Settings },
  { label: 'Leads', href: '/(crm)/leads', Icon: User },
  { label: 'Contacts', href: '/(crm)/contacts', Icon: Inbox },
  { label: 'Manage Users', href: '/(crm)/users', Icon: Users },
];

function AnimatedNavItem({
  item,
  index,
  isActive,
  onPress,
}: {
  item: NavItem;
  index: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(index * 50, withSpring(0, { damping: 15 }));
    scale.value = withDelay(index * 50, withSpring(1, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <YStack
        paddingVertical="$3.5"
        paddingHorizontal="$4"
        marginVertical="$1"
        borderRadius="$3"
        borderWidth={1}
        borderColor={isActive ? '$primary' : 'transparent'}
        backgroundColor={isActive ? '$primary' + '15' : 'transparent'}
        asChild
      >
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <XStack alignItems="center" gap="$3">
            <item.Icon
              size={20}
              color={isActive ? theme.primary.get() : theme.mutedForeground.get()}
            />
            <Text
              fontSize="$4"
              fontWeight={isActive ? '600' : '500'}
              color={isActive ? '$primary' : '$color'}
            >
              {item.label}
            </Text>
          </XStack>
        </Pressable>
      </YStack>
    </Animated.View>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href.split('/').slice(0, -1).join('/'));

  return (
    <YStack
      f={1}
      width={260}
      backgroundColor="$card"
      borderRightWidth={1}
      borderRightColor="$borderColor"
      elevation={4}
    >
      <YStack
        paddingVertical="$6"
        paddingHorizontal="$5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        gap="$2"
      >
        <XStack alignItems="center" gap="$2.5">
          <Text fontSize="$9" fontWeight="bold" color="$primary">
            CRM
          </Text>
          <YStack
            paddingHorizontal="$2.5"
            paddingVertical="$1"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$primary"
          >
            <Text fontSize="$1" fontWeight="700" color="$primary">
              New
            </Text>
          </YStack>
        </XStack>
        <Text opacity={0.7} fontSize="$2" fontWeight="500">
          Account executive workspace
        </Text>
      </YStack>

      <ScrollView
        f={1}
        paddingVertical="$4"
        paddingHorizontal="$3"
        showsVerticalScrollIndicator={false}
      >
        {NAV_ITEMS.map((item, index) => {
          const active = isActive(item.href);
          return (
            <AnimatedNavItem
              key={item.href}
              item={item}
              index={index}
              isActive={active}
              onPress={() => router.push(item.href as never)}
            />
          );
        })}
      </ScrollView>

      <XStack
        paddingVertical="$4"
        paddingHorizontal="$5"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        alignItems="center"
        justifyContent="space-between"
      >
        <YStack>
          <Text fontSize="$2" fontWeight="500" opacity={0.7}>
            Alex Johnson
          </Text>
          <Text fontSize="$2" opacity={0.7}>
            alex.johnson@company.com
          </Text>
        </YStack>
        <Text fontSize="$2" fontWeight="500" opacity={0.7}>
          v1.0.0
        </Text>
      </XStack>
    </YStack>
  );
}
