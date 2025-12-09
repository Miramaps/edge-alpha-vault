import { useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/**
 * Custom wrapper to prevent body scroll when wallet modal is open
 */
export function CustomWalletModal() {
  useEffect(() => {
    // Prevent body scroll when modal might be open
    const handleModalOpen = () => {
      document.body.style.overflow = 'hidden';
    };

    const handleModalClose = () => {
      document.body.style.overflow = '';
    };

    // Listen for wallet adapter modal events
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('.wallet-adapter-modal-wrapper');
      if (modal) {
        handleModalOpen();
      } else {
        handleModalClose();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      handleModalClose();
    };
  }, []);

  return null;
}

