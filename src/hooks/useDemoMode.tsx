import { createContext, useContext, ReactNode } from 'react';

interface DemoContextType {
  isDemo: boolean;
  usePrefix: boolean;
}

const DemoContext = createContext<DemoContextType>({ isDemo: false, usePrefix: false });

export function DemoProvider({ children, usePrefix = false }: { children: ReactNode; usePrefix?: boolean }) {
  return <DemoContext.Provider value={{ isDemo: true, usePrefix }}>{children}</DemoContext.Provider>;
}

export function useDemoMode() {
  return useContext(DemoContext).isDemo;
}

export function useDemoPrefix() {
  const ctx = useContext(DemoContext);
  return ctx.isDemo && ctx.usePrefix ? '/demo' : '';
}
