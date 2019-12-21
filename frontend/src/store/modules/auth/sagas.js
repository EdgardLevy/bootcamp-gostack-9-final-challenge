import {takeLatest, call, put, all} from 'redux-saga/effects';
import {toast} from 'react-toastify';
import {signInSucess, signFailure} from './actions';
import history from '~/services/history';
import api from '~/services/api';

export function* singIn({payload}) {
  try {
    const {email, password} = payload;

    const response = yield call(api.post, 'sessions', {email, password});
    console.tron.log(response);
    const {token, user} = response.data;
    if (!user) {
      toast.error('Usuário e/ou senha inválidos');
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSucess(token, user));

    history.push('/students');
  } catch (error) {
    toast.error('Falha na autenticação, verifique seus dados');
    console.tron.log(error);
    yield put(signFailure());
  }
}

export function* singUp({payload}) {
  try {
    const {name, email, password} = payload;
    yield call(api.post, 'users', {name, email, password, provider: true});
    history.push('/');
  } catch (error) {
    toast.error('Falha no cadastro, verifique seus dados');
    yield put(signFailure());
  }
}

export function setToken({payload}) {
  console.tron.log(`setToken()`, payload);
  if (!payload) return;
  const {token} = payload.auth;
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', singIn),
  takeLatest('@auth/SIGN_UP_REQUEST', singUp),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
