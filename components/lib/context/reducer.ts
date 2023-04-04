export type Action = { type: 'OPEN_CREATE_ESCROW_MODAL' } | { type: 'CLOSE_CREATE_ESCROW_MODAL' };

export type State = {
  createEscrowModalOpen: boolean;
};

export const defaultState = (): State => ({
  createEscrowModalOpen: false,
});

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'OPEN_CREATE_ESCROW_MODAL': {
      return { ...state, createEscrowModalOpen: true };
    }
    case 'CLOSE_CREATE_ESCROW_MODAL': {
      return { ...state, createEscrowModalOpen: false };
    }
  }
};
