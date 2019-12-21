import React, {useEffect, useState} from 'react';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';

import {parseISO, formatRelative} from 'date-fns';

import Background from '~/components/Background';
import Button from '~/components/Button';
import HelpOrder from '~/components/HelpOrder';
import api from '~/services/api';

import {Container, List} from './styles';

function HelpOrderList({navigation, isFocused}) {
  const student = useSelector(state => state.student.profile);

  const [helpOrders, setHelpOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHelpOrders() {
      setLoading(true);
      const response = await api.get(`students/${student.id}/help-orders`);
      const {data} = response;

      setHelpOrders(
        data.records
          .map(item => {
            item.dateFormatted = formatRelative(
              parseISO(item.created_at),
              new Date(),
              {
                addSuffix: true,
              }
            );
            return item;
          })
          .sort((a, b) => a.id < b.id)
      );
      setLoading(false);
    }
    loadHelpOrders();
  }, [student, isFocused]);

  async function handleAdd() {
    navigation.navigate('NewHelpOrder', {
      student_id: student.id,
    });
  }

  function handleItemClick(helpOrder) {
    navigation.navigate('HelpOrderAnswer', {
      helpOrder,
    });
  }

  return (
    <Background>
      <Container>
        <Button loading={loading} onPress={handleAdd}>
          New request for assistance
        </Button>
        <List
          data={helpOrders}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <HelpOrder data={item} onPress={() => handleItemClick(item)} />
          )}
        />
      </Container>
    </Background>
  );
}

export default withNavigationFocus(HelpOrderList);
