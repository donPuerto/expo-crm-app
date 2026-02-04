import React from 'react';
import { YStack } from '@/interface/primitives';

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Collapsible({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <YStack gap="$2">{children}</YStack>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error('CollapsibleTrigger must be used within Collapsible');

  return (
    <YStack onPress={() => ctx.setOpen(!ctx.open)} cursor="pointer" pressStyle={{ opacity: 0.8 }}>
      {children}
    </YStack>
  );
}

export function CollapsibleContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error('CollapsibleContent must be used within Collapsible');
  if (!ctx.open) return null;
  return <YStack>{children}</YStack>;
}
