import { XStack, Text } from 'tamagui';

export default function Topbar() {
  return (
    <XStack
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      paddingVertical="$3"
      paddingHorizontal="$5"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Text fontSize="$4" fontWeight="600">
        Dashboard
      </Text>
    </XStack>
  );
}
