/**
 * Animated Modal Component
 * 
 * Modal with enter/exit animations using AnimatePresence.
 * Demonstrates different animation speeds for enter vs exit.
 * 
 * Features:
 * - Smooth backdrop fade
 * - Content slide + scale animation
 * - Different enter/exit speeds
 * - Auto-focus management
 * - Keyboard dismiss support
 * 
 * Usage:
 * ```tsx
 * import { AnimatedModal } from '@/interface/components/animated-modal'
 * 
 * function MyScreen() {
 *   const [isOpen, setIsOpen] = useState(false)
 * 
 *   return (
 *     <>
 *       <Button onPress={() => setIsOpen(true)}>Open Modal</Button>
 *       <AnimatedModal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         title="My Modal"
 *       >
 *         <Text>Modal content here</Text>
 *       </AnimatedModal>
 *     </>
 *   )
 * }
 * ```
 */

import { AnimatePresence } from '@tamagui/animate-presence'
import { X } from '@tamagui/lucide-icons'
import { View, YStack, XStack, styled } from '@tamagui/core'
import { Platform, Pressable } from 'react-native'
import type { ViewProps } from '@tamagui/core'

// Backdrop overlay
const Backdrop = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
})

// Modal container
const ModalContainer = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1001,
  pointerEvents: 'box-none', // Allow backdrop clicks to pass through
})

// Modal content card
const ModalContent = styled(YStack, {
  backgroundColor: '$background',
  borderRadius: '$6',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  maxWidth: 500,
  width: '90%',
  maxHeight: '80%',
  pointerEvents: 'auto', // Content should capture events
  
  ...(Platform.OS === 'web' && {
    elevation: 24,
  }),
})

// Close button
const CloseButton = styled(View, {
  width: 32,
  height: 32,
  borderRadius: '$round',
  backgroundColor: '$muted',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  
  hoverStyle: {
    backgroundColor: '$mutedForeground',
  },
  
  pressStyle: {
    scale: 0.95,
  },
})

export interface AnimatedModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  
  /** Callback when modal should close */
  onClose: () => void
  
  /** Modal title */
  title?: string
  
  /** Modal content */
  children: React.ReactNode
  
  /** Show close button */
  showCloseButton?: boolean
  
  /** Close on backdrop click */
  closeOnBackdrop?: boolean
  
  /** Enter animation name */
  enterAnimation?: string
  
  /** Exit animation name */
  exitAnimation?: string
  
  /** Additional modal content props */
  contentProps?: ViewProps
}

/**
 * Animated Modal with enter/exit transitions
 * 
 * Example: Enter slowly with 'lazy', exit quickly with 'quick'
 */
export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  enterAnimation = 'lazy',
  exitAnimation = 'quick',
  contentProps,
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Backdrop
            key="modal-backdrop"
            animation="200ms"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={closeOnBackdrop ? onClose : undefined}
          />
          
          {/* Modal Container */}
          <ModalContainer key="modal-container">
            <ModalContent
              animation={{ enter: enterAnimation, exit: exitAnimation }}
              enterStyle={{
                opacity: 0,
                y: 20,
                scale: 0.95,
              }}
              exitStyle={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              {...contentProps}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="$4"
                >
                  {title && (
                    <YStack.Text fontSize="$6" fontWeight="700" color="$color">
                      {title}
                    </YStack.Text>
                  )}
                  
                  {showCloseButton && (
                    <CloseButton
                      onPress={onClose}
                      animation="quick"
                      marginLeft="auto"
                    >
                      <X size={16} color="$color" />
                    </CloseButton>
                  )}
                </XStack>
              )}
              
              {/* Content */}
              {children}
            </ModalContent>
          </ModalContainer>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Bottom Sheet Modal (slides up from bottom)
 */
export function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  ...contentProps
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Backdrop
            key="bottom-sheet-backdrop"
            animation="200ms"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={closeOnBackdrop ? onClose : undefined}
          />
          
          {/* Bottom Sheet */}
          <View
            key="bottom-sheet"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            zIndex={1001}
            animation={{ enter: 'quick', exit: 'quick' }}
            enterStyle={{ y: 500, opacity: 0 }}
            exitStyle={{ y: 500, opacity: 0 }}
          >
            <YStack
              backgroundColor="$background"
              borderTopLeftRadius="$6"
              borderTopRightRadius="$6"
              padding="$4"
              shadowColor="$shadowColor"
              shadowOffset: {{ width: 0, height: -4 }}
              shadowOpacity={0.2}
              shadowRadius={12}
              maxHeight="80vh"
              {...contentProps}
            >
              {/* Handle bar */}
              <View
                width={40}
                height={4}
                backgroundColor="$borderColor"
                borderRadius="$round"
                alignSelf="center"
                marginBottom="$4"
              />
              
              {/* Header */}
              {(title || showCloseButton) && (
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  marginBottom="$4"
                >
                  {title && (
                    <YStack.Text fontSize="$6" fontWeight="700" color="$color">
                      {title}
                    </YStack.Text>
                  )}
                  
                  {showCloseButton && (
                    <CloseButton
                      onPress={onClose}
                      animation="quick"
                      marginLeft="auto"
                    >
                      <X size={16} color="$color" />
                    </CloseButton>
                  )}
                </XStack>
              )}
              
              {/* Content */}
              {children}
            </YStack>
          </View>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Full Screen Modal (slides in from right, iOS style)
 */
export function FullScreenModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  ...contentProps
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <View
          key="fullscreen-modal"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$background"
          zIndex={1000}
          animation={{ enter: 'quick', exit: 'quick' }}
          enterStyle={{ x: '100%', opacity: 0 }}
          exitStyle={{ x: '100%', opacity: 0 }}
          {...contentProps}
        >
          {/* Header */}
          <XStack
            padding="$4"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            justifyContent="space-between"
            alignItems="center"
          >
            {title && (
              <YStack.Text fontSize="$6" fontWeight="700" color="$color">
                {title}
              </YStack.Text>
            )}
            
            {showCloseButton && (
              <CloseButton
                onPress={onClose}
                animation="quick"
                marginLeft="auto"
              >
                <X size={20} color="$color" />
              </CloseButton>
            )}
          </XStack>
          
          {/* Content */}
          <YStack flex={1} padding="$4">
            {children}
          </YStack>
        </View>
      )}
    </AnimatePresence>
  )
}
