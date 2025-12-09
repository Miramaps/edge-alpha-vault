import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TwoFactorModal } from "@/components/security/TwoFactorModal";

interface WalletAddressContextType {
  address: string | null;
  setAddress: (address: string | null) => void;
  disconnect: () => void;
  is2FAVerified: boolean;
}

const WalletAddressContext = createContext<WalletAddressContextType | undefined>(undefined);

export function WalletAddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<string | null>(null);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);
  const [is2FAVerified, setIs2FAVerified] = useState(false);

  // Load address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wallet_address");
    if (saved) {
      check2FAStatus(saved);
    }
  }, []);

  // Check if 2FA is verified for the current address
  const check2FAStatus = (walletAddress: string) => {
    const is2FAEnabled = localStorage.getItem(`2fa_enabled_${walletAddress}`) === "true";
    
    if (is2FAEnabled) {
      // Check if there's a valid session
      const sessionKey = `2fa_verified_${walletAddress}`;
      const sessionExpiry = localStorage.getItem(sessionKey);
      
      if (sessionExpiry && parseInt(sessionExpiry) > Date.now()) {
        // Session is still valid
        setIs2FAVerified(true);
        setAddressState(walletAddress);
      } else {
        // Session expired or doesn't exist, need to verify
        setIs2FAVerified(false);
        setPendingAddress(walletAddress);
        setShow2FAModal(true);
      }
    } else {
      // 2FA not enabled, allow access
      setIs2FAVerified(true);
      setAddressState(walletAddress);
    }
  };

  const setAddress = (newAddress: string | null) => {
    if (newAddress) {
      // Check 2FA status before setting address
      check2FAStatus(newAddress);
    } else {
      setAddressState(null);
      setIs2FAVerified(false);
      localStorage.removeItem("wallet_address");
    }
  };

  const handle2FAVerify = () => {
    if (pendingAddress) {
      setAddressState(pendingAddress);
      setIs2FAVerified(true);
      localStorage.setItem("wallet_address", pendingAddress);
    }
    setShow2FAModal(false);
    setPendingAddress(null);
  };

  const handle2FACancel = () => {
    setShow2FAModal(false);
    // If user cancels, clear the pending address but keep it in localStorage
    // so they can try again later
    setPendingAddress(null);
    setIs2FAVerified(false);
    // Don't set the address - user needs to verify 2FA first
  };

  const disconnect = () => {
    setAddressState(null);
    setIs2FAVerified(false);
    localStorage.removeItem("wallet_address");
    // Clear 2FA session
    if (address) {
      localStorage.removeItem(`2fa_verified_${address}`);
    }
  };

  return (
    <WalletAddressContext.Provider value={{ address, setAddress, disconnect, is2FAVerified }}>
      {children}
      {pendingAddress && (
        <TwoFactorModal
          isOpen={show2FAModal}
          walletAddress={pendingAddress}
          onVerify={handle2FAVerify}
          onCancel={handle2FACancel}
        />
      )}
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

