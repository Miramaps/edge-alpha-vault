import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletAddressContextType {
  address: string | null;
  setAddress: (address: string | null) => void;
  disconnect: () => void;
}

const WalletAddressContext = createContext<WalletAddressContextType | undefined>(undefined);

export function WalletAddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<string | null>(null);

  // Load address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wallet_address");
    if (saved) {
      setAddressState(saved);
    }
  }, []);

  const setAddress = (newAddress: string | null) => {
    setAddressState(newAddress);
    if (newAddress) {
      localStorage.setItem("wallet_address", newAddress);
    } else {
      localStorage.removeItem("wallet_address");
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem("wallet_address");
  };

  return (
    <WalletAddressContext.Provider value={{ address, setAddress, disconnect }}>
      {children}
    </WalletAddressContext.Provider>
  );
}

export function useWalletAddress() {
  const context = useContext(WalletAddressContext);
  if (context === undefined) {
    throw new Error("useWalletAddress must be used within a WalletAddressProvider");
  }
  return context;
}

