import React, {useState} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';
import Button from '~/components/Button';
import api from '~/services/api';

import {Container, Answer} from './styles';

export default function NewHelpOrder({navigation}) {
  const student_id = navigation.getParam('student_id');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  async function handleSend() {
    try {
      setLoading(true);
      await api.post(`/students/${student_id}/help-orders`, {question});
      setLoading(false);
      navigation.navigate('HelpOrderList');
    } catch (error) {
      setLoading(false);
      Alert.alert(error.response.data.errors[0]);
    }
  }

  return (
    <Background>
      <Container>
        <Answer
          placeholder="Type your request for assistance"
          onChangeText={setQuestion}
        />

        <Button loading={loading} onPress={handleSend}>
          Send
        </Button>
      </Container>
    </Background>
  );
}

NewHelpOrder.navigationOptions = ({navigation}) => ({
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={25} color="#ee4d64" />
    </TouchableOpacity>
  ),
});
