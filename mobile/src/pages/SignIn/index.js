import React, {useState} from 'react';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import {signInRequest} from '~/store/modules/auth/actions';

import {Container, Form, FormInput, SubmitButton} from './styles';

export default function SignIn({navigation}) {
  const dispatch = useDispatch();

  const [userID, setUserID] = useState('');

  const loading = useSelector(state => state.auth.loading);
  function handleSubmit() {
    dispatch(signInRequest(userID));
  }
  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <FormInput
            keyboardType="number-pad"
            placeholder="Enter your registration ID"
            returnKeyType="send"
            onSubmitEditing={() => {}}
            value={userID}
            onChangeText={setUserID}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Sign In
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
