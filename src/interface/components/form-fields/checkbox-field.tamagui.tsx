import React from 'react';
import { YStack, XStack, Label, Checkbox, Text } from '@/interface/primitives';
import { Check } from '@tamagui/lucide-icons';
import type { GetProps } from 'tamagui';

export interface CheckboxFieldProps {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: GetProps<typeof Checkbox>['size'];
}

/**
 * CheckboxField - Reusable checkbox with label and error state
 *
 * @example
 * <CheckboxField
 *   id="terms"
 *   label="Accept terms and conditions"
 *   required
 *   checked={acceptedTerms}
 *   onCheckedChange={setAcceptedTerms}
 * />
 */
export function CheckboxField({
  id,
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  required = false,
  error,
  size = '$4',
}: CheckboxFieldProps) {
  return (
    <YStack gap="$2">
      <XStack gap="$3" alignItems="flex-start">
        <Checkbox
          id={id}
          size={size}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        >
          <Checkbox.Indicator>
            <Check size={16} />
          </Checkbox.Indicator>
        </Checkbox>

        <YStack flex={1} gap="$1">
          <Label
            htmlFor={id}
            fontSize="$3"
            fontWeight="500"
            color={error ? '$red10' : '$color'}
            pressStyle={{ opacity: 0.8 }}
            cursor="pointer"
          >
            {label}
            {required && (
              <Text color="$red10" marginLeft="$1">
                *
              </Text>
            )}
          </Label>

          {description && (
            <Text fontSize="$2" color="$gray11" lineHeight="$1">
              {description}
            </Text>
          )}

          {error && (
            <Text fontSize="$2" color="$red10" lineHeight="$1">
              {error}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}
