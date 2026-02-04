/**
 * Page Transition Examples
 *
 * Demonstrates different page transition patterns for the app.
 * Use these examples as reference for implementing transitions in your screens.
 */

import { View, Text, YStack, XStack } from '@tamagui/core';
import { AnimatePresence } from '@tamagui/animate-presence';
import { useState } from 'react';

/**
 * Example 1: Simple Modal Transition
 *
 * Modal slides up from bottom, slides down on close
 */
export function ModalExample() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      <Text onPress={() => setIsVisible(!isVisible)}>Toggle Modal</Text>

      <AnimatePresence>
        {isVisible && (
          <View
            key="modal"
            animation="quick"
            enterStyle={{ opacity: 0, y: 50, scale: 0.95 }}
            exitStyle={{ opacity: 0, y: 50, scale: 0.95 }}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="$background"
            padding="$4"
          >
            <Text>Modal Content</Text>
            <Text onPress={() => setIsVisible(false)}>Close</Text>
          </View>
        )}
      </AnimatePresence>
    </View>
  );
}

/**
 * Example 2: Stack Navigation Transition
 *
 * Pages slide in from right (forward), slide out to left
 * Mimics iOS navigation stack
 */
export function StackNavigationExample() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <AnimatePresence exitBeforeEnter>
      {currentPage === 'home' && (
        <View
          key="home"
          animation={{ enter: 'quick', exit: '200ms' }}
          enterStyle={{ opacity: 0, x: 30 }}
          exitStyle={{ opacity: 0, x: -30 }}
          flex={1}
        >
          <Text fontSize="$6">Home</Text>
          <Text onPress={() => setCurrentPage('details')}>Go to Details →</Text>
        </View>
      )}

      {currentPage === 'details' && (
        <View
          key="details"
          animation={{ enter: 'quick', exit: '200ms' }}
          enterStyle={{ opacity: 0, x: 30 }}
          exitStyle={{ opacity: 0, x: -30 }}
          flex={1}
        >
          <Text fontSize="$6">Details</Text>
          <Text onPress={() => setCurrentPage('home')}>← Back</Text>
        </View>
      )}
    </AnimatePresence>
  );
}

/**
 * Example 3: Staggered List Animation
 *
 * List items animate in with staggered delay
 */
export function StaggeredListExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <YStack gap="$2" padding="$4">
      {items.map((item, i) => (
        <View
          key={item}
          animation={['bouncy', { delay: i * 50 }]}
          enterStyle={{ opacity: 0, scale: 0.8, y: 20 }}
          backgroundColor="$card"
          padding="$4"
          borderRadius="$4"
        >
          <Text>{item}</Text>
        </View>
      ))}
    </YStack>
  );
}

/**
 * Example 4: Tab Transition
 *
 * Simple fade between tabs
 */
export function TabTransitionExample() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

  return (
    <YStack>
      <XStack gap="$2" padding="$2">
        {tabs.map((tab, i) => (
          <View
            key={tab}
            onPress={() => setActiveTab(i)}
            padding="$3"
            backgroundColor={activeTab === i ? '$primary' : '$muted'}
            borderRadius="$2"
            cursor="pointer"
          >
            <Text color={activeTab === i ? '$primaryForeground' : '$mutedForeground'}>{tab}</Text>
          </View>
        ))}
      </XStack>

      <AnimatePresence exitBeforeEnter>
        <View
          key={activeTab}
          animation="200ms"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          padding="$4"
        >
          <Text>Content for {tabs[activeTab]}</Text>
        </View>
      </AnimatePresence>
    </YStack>
  );
}

/**
 * Example 5: Interactive Button Animations
 *
 * Buttons with hover, press, and focus animations
 */
export function InteractiveButtonExample() {
  return (
    <YStack gap="$4" padding="$4">
      {/* Bounce on press */}
      <View
        animation="bouncy"
        backgroundColor="$primary"
        padding="$4"
        borderRadius="$4"
        hoverStyle={{ scale: 1.05 }}
        pressStyle={{ scale: 0.95 }}
        cursor="pointer"
      >
        <Text color="$primaryForeground" textAlign="center">
          Bouncy Button
        </Text>
      </View>

      {/* Glow on hover */}
      <View
        animation="quick"
        backgroundColor="$secondary"
        padding="$4"
        borderRadius="$4"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        hoverStyle={{
          shadowOpacity: 0.3,
          shadowRadius: 12,
          y: -2,
        }}
        pressStyle={{ scale: 0.98 }}
        cursor="pointer"
      >
        <Text color="$secondaryForeground" textAlign="center">
          Glow Button
        </Text>
      </View>

      {/* Rotate on press */}
      <View
        animation="lazy"
        backgroundColor="$accent"
        padding="$4"
        borderRadius="$4"
        pressStyle={{ rotate: '5deg', scale: 0.95 }}
        cursor="pointer"
      >
        <Text color="$accentForeground" textAlign="center">
          Rotate Button
        </Text>
      </View>
    </YStack>
  );
}
