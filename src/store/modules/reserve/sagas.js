import { select, call, put, all, takeLatest } from 'redux-saga/effects'
import { addReserveRequest, addReserveSuccess, updateAmountSuccess } from './actions'
import api from '../../../services/api'
import history from '../../../services/history'

function* addToReserve({ id }) {
    const tripExists = yield select(
        state => state.reserve.find(trip => trip.id === id) //Verifica se a trip já existe
    );

    const myStock = yield call(api.get, `/stock/${id}`); //Captura o stock através da chamada à API (passando o id como param)

    const stockAmount = myStock.data.amount; //Captura o atributo amount

    const currentStock = tripExists ? tripExists.amount : 0; //Verifica se a viagem existe. Se sim, pega a quantidade da viagem dentro da lista. Se não, seta o amount pra 0

    const amount = currentStock + 1; //Incrementa o contador de estoque

    if (amount > stockAmount) {
        alert('Quantidade máxima atingida');
        return;
    }

    if (tripExists) {        
        yield put(updateAmountSuccess(id, amount)); //Chama a função do actions, passando o amount incrementado para a id encontrada
    } else { //Caso não encontre
        const response = yield call(api.get, `trips/${id}`); //Faz a requisição com a id, vindo da API
        const data = { //Cria um novo objeto data, passando os atributos da response
            ...response.data,
            amount: 1,
        }
        yield put(addReserveSuccess(data)); //Puxa a função addReserveSuccess, passando o objeto data como parâmetro
        history.push('/reservas')
    }
}

function* updateAmount({ id, amount }) {
    if(amount <= 0) return; //Não permite passar abaixo de 0

    const myStock = yield call(api.get, `/stock/${id}`); //Caputrando o retorno da api

    const stockAmount = myStock.data.amount //Caputrando o atributo stock do objeto

    if (amount > stockAmount) {
        alert('Quantidade máxima atingida!');
        return
    }

    yield put(updateAmountSuccess(id, amount)); //Se passar pelas verificações, faz o put passando o id e o amount esperados pela função chamada
}

export default all([
    takeLatest('ADD_RESERVE_REQUEST', addToReserve),
    takeLatest('UPDATE_RESERVE_REQUEST', updateAmount)
]);