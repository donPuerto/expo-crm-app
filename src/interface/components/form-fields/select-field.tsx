import React from 'react';
import {
  YStack,
  Label,
  Select,
  Text,
  Adapt,
  Sheet,
  Check,
  ChevronDown,
  ChevronUp,
  type GetProps,
} from '@/interface/primitives';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: GetProps<typeof Select>['size'];
}

/**
 * SelectField - Reusable select dropdown with label and mobile adaptation
 *
 * @example
 * <SelectField
 *   id="role"
 *   label="User Role"
 *   placeholder="Select a role"
 *   options={[
 *     { label: 'Admin', value: 'admin' },
 *     { label: 'User', value: 'user' },
 *   ]}
 *   value={role}
 *   onValueChange={setRole}
 *   required
 * />
 */
export function SelectField({
  id,
  label,
  placeholder = 'Select an option',
  options,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  error,
  size = '$4',
}: SelectFieldProps) {
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

      <Select
        id={id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        size={size}
        disablePreventBodyScroll
      >
        <Select.Trigger
          iconAfter={ChevronDown}
          borderColor={error ? '$red10' : '$borderColor'}
          disabled={disabled}
        >
          <Select.Value placeholder={placeholder} />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
          </Select.ScrollUpButton>

          <Select.Viewport minWidth={200}>
            <Select.Group>
              <Select.Label>{label}</Select.Label>
              {options.map((option, index) => (
                <Select.Item key={option.value} index={index} value={option.value}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>

      {error && (
        <Text fontSize="$2" color="$red10">
          {error}
        </Text>
      )}
    </YStack>
  );
}
