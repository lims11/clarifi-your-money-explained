import { createContext, useContext, ReactNode } from 'react';

const DemoContext = createContext(false);

export function DemoProvider({ children }: { children: ReactNode }) {
  return <DemoContext.Provider value={true}>{children}</DemoContext.Provider>;
}

export function useDemoMode() {
  return useContext(DemoContext);
}
