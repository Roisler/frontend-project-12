import ModalAddChannel from './ModalAddChannel';
import ModalRemoveChannel from './ModalRemoveChannel';
import ModalRenameChannel from './ModalRenameChannel';

const modals = {
  adding: ModalAddChannel,
  removing: ModalRemoveChannel,
  renaming: ModalRenameChannel,
};

export default (modalName) => modals[modalName];
