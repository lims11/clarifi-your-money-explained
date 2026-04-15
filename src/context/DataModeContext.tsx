import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DataMode = 'manual' | 'upload' | 'sync';

interface DataModeContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  isManual: boolean;
  isUpload: boolean;
}

const DataModeContext = createContext<DataModeContextType | null>(null);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DataMode>(() => {
    return (localStorage.getItem('sonfi_data_mode') as DataMode) || 'upload';
  });

  useEffect(() => {
    localStorage.setItem('sonfi_data_mode', mode);
  }, [mode]);

  return (
    <DataModeContext.Provider value={{
      mode,
      setMode,
      isManual: mode === 'manual',
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
