import { useContext } from 'react';

import Context from '.';

const Hook = () => {
  const { state, dispatch } = useContext(Context);
  const openCreateEscrowModal = () => dispatch({ type: 'OPEN_CREATE_ESCROW_MODAL' });
  const closeCreateEscrowModal = () => dispatch({ type: 'CLOSE_CREATE_ESCROW_MODAL' });
  return {
    state,
    openCreateEscrowModal,
    closeCreateEscrowModal,
  };
};

export default Hook;
