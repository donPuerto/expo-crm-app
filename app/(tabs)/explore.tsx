import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {
  Accordion,
  ChevronDown,
  FileText,
  Paragraph,
  SizableText,
  Text,
  View,
  YStack,
} from '@/interface/primitives';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<FileText size={310} color="#808080" style={styles.headerImage} />}
    >
      <View style={styles.titleContainer}>
        <SizableText size="$8" fontWeight="800" style={{ fontFamily: Fonts.rounded }}>
          Explore
        </SizableText>
      </View>
      <Paragraph>This app includes example code to help you get started.</Paragraph>
      <Accordion type="multiple" defaultValue={[]} overflow="hidden" width="100%" gap="$2">
        <Accordion.Item value="routing">
          <Accordion.Header>
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Paragraph fontWeight="700">File-based routing</Paragraph>
              <ChevronDown size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <YStack gap="$2" paddingVertical="$2">
              <Paragraph>
                This app has two screens: <Text fontWeight="700">app/(tabs)/index.tsx</Text> and{' '}
                <Text fontWeight="700">app/(tabs)/explore.tsx</Text>
              </Paragraph>
              <Paragraph>
                The layout file in <Text fontWeight="700">app/(tabs)/_layout.tsx</Text> sets up the
                tab navigator.
              </Paragraph>
              <ExternalLink href="https://docs.expo.dev/router/introduction">
                <Paragraph color="$primary" textDecorationLine="underline">
                  Learn more
                </Paragraph>
              </ExternalLink>
            </YStack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="platforms">
          <Accordion.Header>
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Paragraph fontWeight="700">Android, iOS, and web support</Paragraph>
              <ChevronDown size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <YStack gap="$2" paddingVertical="$2">
              <Paragraph>
                You can open this project on Android, iOS, and the web. To open the web version,
                press <Text fontWeight="700">w</Text> in the terminal running this project.
              </Paragraph>
            </YStack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="images">
          <Accordion.Header>
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Paragraph fontWeight="700">Images</Paragraph>
              <ChevronDown size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <YStack gap="$2" paddingVertical="$2">
              <Paragraph>
                For static images, you can use the <Text fontWeight="700">@2x</Text> and{' '}
                <Text fontWeight="700">@3x</Text> suffixes to provide files for different screen
                densities
              </Paragraph>
              <Image
                source={require('~assets/images/react-logo.png')}
                style={{ width: 100, height: 100, alignSelf: 'center' }}
              />
              <ExternalLink href="https://reactnative.dev/docs/images">
                <Paragraph color="$primary" textDecorationLine="underline">
                  Learn more
                </Paragraph>
              </ExternalLink>
            </YStack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="themes">
          <Accordion.Header>
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Paragraph fontWeight="700">Light and dark mode components</Paragraph>
              <ChevronDown size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <YStack gap="$2" paddingVertical="$2">
              <Paragraph>
                This template has light and dark mode support. The{' '}
                <Text fontWeight="700">useColorScheme()</Text> hook lets you inspect what the
                user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
              </Paragraph>
              <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
                <Paragraph color="$primary" textDecorationLine="underline">
                  Learn more
                </Paragraph>
              </ExternalLink>
            </YStack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="animations">
          <Accordion.Header>
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Paragraph fontWeight="700">Animations</Paragraph>
              <ChevronDown size={16} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <YStack gap="$2" paddingVertical="$2">
              <Paragraph>
                This template includes an example of an animated component. The{' '}
                <Text fontWeight="700">components/HelloWave.tsx</Text> component uses the powerful{' '}
                <Text fontWeight="700" fontFamily={Fonts.mono}>
                  react-native-reanimated
                </Text>{' '}
                library to create a waving hand animation.
              </Paragraph>
              {Platform.select({
                ios: (
                  <Paragraph>
                    The <Text fontWeight="700">components/ParallaxScrollView.tsx</Text> component
                    provides a parallax effect for the header image.
                  </Paragraph>
                ),
              })}
            </YStack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
