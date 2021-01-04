import produce from 'immer';

export default function reserve(state = [], action) {
    switch (action.type) {
        case 'ADD_RESERVE_SUCCESS':
            return produce(state, draft => {
                draft.push(action.trip);           
            });

        case 'REMOVE_RESERVE':
            return produce(state, draft => {
                const tripIndex = draft.findIndex(trip => trip.id === action.id); //Aqui ele não tem mais o trip porque ele está mandando diretamente o id pela chamada da função

                if (tripIndex >= 0) {
                    draft.splice(tripIndex, 1); //splice para excluir o primeiro objeto.
                }
            })
        
        case 'UPDATE_RESERVE_SUCCESS': {

            return produce(state, draft => {
                const tripIndex = draft.findIndex(trip => trip.id === action.id); //Buscando pelo index

                if(tripIndex >= 0) {
                    draft[tripIndex].amount = Number(action.amount) //Localiza, dá o .amount, substitui pelo que está sendo enviado pelo dispatch
                }
            });
        }

        default:
            return state;
    }
}