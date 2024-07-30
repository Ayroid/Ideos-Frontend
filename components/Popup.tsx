import { PopupProps } from "@/types";
import { useEffect, useState } from "react";
import "./Popup.css";

const Popup = ({ children, isOpen, onClose, container }: PopupProps) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  return (
    <div
      className={`fixed z-50 flex h-screen w-screen items-center justify-center bg-[#20202056]`}
      onClick={onClose}
    >
      <div
        className={`popup-content rounded-lg ${container && "bg-white"} p-4 ${
          show ? "fade-in" : "fade-out"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
