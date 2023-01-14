import { AddChannel, RenameChannel, RemoveChannel } from './Modals';

const modals = {
  adding: AddChannel,
  removing: RemoveChannel,
  renaming: RenameChannel,
};

export default (modalName) => modals[modalName];
