import { PopupProps } from "@/types/kanban";
import "./Popup.css";

const Popup = ({ children, isOpen, onClose, container }: PopupProps) => {
  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[#20202056]`}
      onClick={onClose}
    >
      <div
        className={`popup-content rounded-lg ${container && "bg-white"} p-4 ${
          isOpen ? "fade-in" : "fade-out"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
