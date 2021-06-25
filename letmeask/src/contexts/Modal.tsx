import { useState } from "react";
import { createContext } from "react";

interface ModalProps {
  title: string;
  description: string;
  confirmText?: string;
  onClickConfirm?: () => void;
  autoHide?: boolean;
}

interface ContextProps {
  showModal: (modalProps: ModalProps) => void;
  hideModal: () => void;
}

const defaultValue: ContextProps = {
  showModal: () => {
    throw new Error("showModal must be defined.");
  },
  hideModal: () => {
    throw new Error("hideModal must be defined");
  },
};

const ModalContext = createContext(defaultValue);

export default ModalContext;

export const ModalProvider: React.FC = ({ children }) => {
  const defaultModalProps: ModalProps = {
    title: "Title",
    description: "Your description here",
    confirmText: "Ok",
    onClickConfirm: () => null,
    autoHide: true,
  };

  //Define se o Modal deve ser  exibido ou não
  const [show, setShow] = useState(false);

  //Propriedades do componente modal
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps);
  const { title, description, confirmText, onClickConfirm, autoHide } =
    modalProps;

  const onClickConfirmHandler = () => {
    if (autoHide) {
      setShow(false);
    }

    onClickConfirm!();
  };

  //Valor a ser passado no Provider
  const modalContextProps: ContextProps = {
    showModal: (props) => {
      setModalProps({ ...modalProps, ...props });
      setShow(true);
    },

    hideModal: () => setShow(false),
  };

  //Aqui usamos o ModalContext.Provider para embrulhar a estrutura do nosso Modal e também o componente filho
  return (
    <ModalContext.Provider value={modalContextProps}>
      {show && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{title}</h2>
            <p>{description}</p>
            <button onClick={onClickConfirmHandler}>{confirmText}</button>
          </div>
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
};
