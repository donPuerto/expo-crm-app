import React from 'react';
import { YStack, XStack, Label, RadioGroup, Text } from '@/interface/primitives';
import type { GetProps } from 'tamagui';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupFieldProps {
  id: string;
  label: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  orientation?: GetProps<typeof RadioGroup>['orientation'];
}

export function RadioGroupField({
  id,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  error,
  orientation = 'vertical',
}: RadioGroupFieldProps) {
  return (
    <YStack gap="$2">
      <Label
        htmlFor={id}
        fontSize="$2"
        fontWeight="600"
        color={error ? '$red10' : '$gray11'}
        textTransform="uppercase"
      >
        {label}
        {required && (
          <Text color="$red10" marginLeft="$1">
            *
          </Text>
        )}
      </Label>

      <RadioGroup
        id={id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        orientation={orientation}
        aria-invalid={!!error}
        disabled={disabled}
        gap="$3"
      >
        {options.map(option => {
          const optionDisabled = disabled || option.disabled;

          return (
            <XStack
              key={option.value}
              gap="$3"
              alignItems="flex-start"
              opacity={optionDisabled ? 0.6 : 1}
            >
              <RadioGroup.Item value={option.value} disabled={optionDisabled}>
                <RadioGroup.Indicator />
              </RadioGroup.Item>

              <YStack flex={1} gap="$1">
                <Text fontSize="$3" fontWeight="500" color={error ? '$red10' : '$color'}>
                  {option.label}
                </Text>

                {option.description && (
                  <Text fontSize="$2" color="$gray11" lineHeight="$1">
                    {option.description}
                  </Text>
                )}
              </YStack>
            </XStack>
          );
        })}
      </RadioGroup>

      {error && (
        <Text fontSize="$2" color="$red10">
          {error}
        </Text>
      )}
    </YStack>
  );
}
