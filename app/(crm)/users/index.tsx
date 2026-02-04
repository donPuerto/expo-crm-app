import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Paragraph, SizableText } from '@/interface/primitives';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadowStyle } from '@/lib/shadow-styles';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  department?: string;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'Administrator',
    status: 'active',
    phone: '+1 234 567 8900',
    department: 'IT',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@company.com',
    role: 'Sales Manager',
    status: 'active',
    phone: '+1 234 567 8901',
    department: 'Sales',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Support Agent',
    status: 'active',
    phone: '+1 234 567 8902',
    department: 'Support',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Marketing Specialist',
    status: 'pending',
    phone: '+1 234 567 8903',
    department: 'Marketing',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'Developer',
    status: 'inactive',
    phone: '+1 234 567 8904',
    department: 'Engineering',
  },
];

function AnimatedUserCard({
  user,
  index,
  onPress,
}: {
  user: User;
  index: number;
  onPress: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const scale = useSharedValue(0.95);
  const borderColor = useThemeColor({}, 'border');
  const cardBg = useThemeColor({}, 'card');
  const tint = useThemeColor({}, 'tint');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  useEffect(() => {
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(index * 50, withSpring(0, { damping: 15 }));
    scale.value = withDelay(index * 50, withSpring(1, { damping: 15 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return successColor;
      case 'pending':
        return warningColor;
      case 'inactive':
        return errorColor;
      default:
        return borderColor;
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
          },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }),
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Paragraph fontWeight="700" style={styles.cardTitle}>
              {user.name}
            </Paragraph>
            <Paragraph style={styles.cardEmail}>{user.email}</Paragraph>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: `${getStatusColor(user.status)}20`,
                borderColor: getStatusColor(user.status),
              },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
            <Paragraph style={[styles.statusText, { color: getStatusColor(user.status) }]}>
              {user.status}
            </Paragraph>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Paragraph style={styles.detailLabel}>Role:</Paragraph>
            <Paragraph style={styles.detailValue}>{user.role}</Paragraph>
          </View>
          {user.department && (
            <View style={styles.detailRow}>
              <Paragraph style={styles.detailLabel}>Department:</Paragraph>
              <Paragraph style={styles.detailValue}>{user.department}</Paragraph>
            </View>
          )}
          {user.phone && (
            <View style={styles.detailRow}>
              <Paragraph style={styles.detailLabel}>Phone:</Paragraph>
              <Paragraph style={[styles.detailValue, { color: tint }]}>{user.phone}</Paragraph>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function UsersListScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: cardBg, borderBottomColor: borderColor },
          createShadowStyle({
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }),
        ]}
      >
        <SizableText size="$8" fontWeight="800" style={[styles.title, { color: textColor }]}>
          Users
        </SizableText>
        <Pressable
          style={[
            styles.addBtn,
            { backgroundColor: tint },
            createShadowStyle({
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }),
          ]}
          onPress={() => {
            router.push('/(crm)/users/add' as never);
          }}
        >
          <Paragraph style={styles.addBtnText}>+ Add User</Paragraph>
        </Pressable>
      </View>
      <FlatList
        data={mockUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <AnimatedUserCard
            user={item}
            index={index}
            onPress={() => {
              router.push({
                pathname: '/(crm)/users/[id]' as never,
                params: { id: item.id },
              } as never);
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardDetails: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
});
