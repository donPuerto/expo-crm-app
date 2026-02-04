import React from 'react';
import { Linking, Pressable } from 'react-native';

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={() => {
        void Linking.openURL(href);
      }}
    >
      {children}
    </Pressable>
  );
}
