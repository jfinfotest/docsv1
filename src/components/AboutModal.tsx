import React from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon, HeartIcon } from './Icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Nuevo modal enfocado exclusivamente en el autor.
// Contenido en español, diseño limpio y neutral.
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior neutral */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 text-white">
          <h2 id="about-modal-title" className="text-lg font-semibold">Acerca del Autor</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition"
            aria-label="Cerrar"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-md mb-4">
              <span className="text-2xl font-bold">JV</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Jhon Valencia</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Ingeniero de Desarrollo de Software</p>

            
          
          </div>
        </div>

        {/* Pie */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
            Hecho con <HeartIcon className="w-4 h-4 mx-1 text-red-500" /> para la comunidad
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2025 FusionDoc. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default AboutModal;