import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DataMode = 'upload' | 'sync';

interface DataModeContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  isUpload: boolean;
}

const DataModeContext = createContext<DataModeContextType | null>(null);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DataMode>(() => {
    const stored = localStorage.getItem('sonfi_data_mode') as DataMode;
    return stored === 'sync' ? 'sync' : 'upload';
  });

  useEffect(() => {
    localStorage.setItem('sonfi_data_mode', mode);
  }, [mode]);

  return (
    <DataModeContext.Provider value={{
      mode,
      setMode,
      isUpload: mode === 'upload',
    }}>
      {children}
    </DataModeContext.Provider>
  );
}

export const useDataMode = () => {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error('useDataMode must be used within DataModeProvider');
  return ctx;
};
