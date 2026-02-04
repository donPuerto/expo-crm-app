import React from 'react';
import { YStack, XStack, Label, Switch, Text, type GetProps } from '@/interface/primitives';

export interface SwitchFieldProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  size?: GetProps<typeof Switch>['size'];
}

/**
 * SwitchField - Reusable switch toggle with label
 *
 * @example
 * <SwitchField
 *   id="notifications"
 *   label="Enable notifications"
 *   description="Receive email updates"
 *   checked={notificationsEnabled}
 *   onCheckedChange={setNotificationsEnabled}
 * />
 */
export function SwitchField({
  id,
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  error,
  size = '$4',
}: SwitchFieldProps) {
  return (
    <YStack gap="$2">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingVertical="$2"
        paddingHorizontal="$3"
        backgroundColor="$background"
        borderRadius="$3"
        borderWidth={1}
        borderColor={error ? '$red10' : '$borderColor'}
      >
        <YStack flex={1} gap="$1" marginRight="$3">
          <Label htmlFor={id} fontSize="$3" fontWeight="500" color={error ? '$red10' : '$color'}>
            {label}
          </Label>

          {description && (
            <Text fontSize="$2" color="$gray11" lineHeight="$1">
              {description}
            </Text>
          )}
        </YStack>

        <Switch
          id={id}
          size={size}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        >
          <Switch.Thumb />
        </Switch>
      </XStack>

      {error && (
        <Text fontSize="$2" color="$red10" paddingHorizontal="$3">
          {error}
        </Text>
      )}
    </YStack>
  );
}
