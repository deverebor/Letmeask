import { useContext } from "react";
import ModalContext from "../contexts/Modal";

const useModal = () => useContext(ModalContext)
export default useModal