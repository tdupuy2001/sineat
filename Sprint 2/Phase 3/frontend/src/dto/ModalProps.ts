interface ModalProps {
    handleClose: () => void;
    show: boolean;
    children: React.ReactNode;
    canGoBack?: boolean;
    handleBack?: () => void;
   }
   