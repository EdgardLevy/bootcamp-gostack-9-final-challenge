import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';

import {parseISO, formatRelative} from 'date-fns';

import Background from '~/components/Background';
import Button from '~/components/Button';
import CheckIn from '~/components/CheckIn';
import api from '~/services/api';

import {Container, List} from './styles';

function CheckIns({isFocused}) {
  const student = useSelector(state => state.student.profile);

  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCheckIns() {
      setLoading(true);
      const response = await api.get(`students/${student.id}/checkins`);
      const {data} = response;
      let idx = 0;
      setCheckIns(
        data
          .map(item => {
            idx += 1;
            item.index = idx;
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
    loadCheckIns();
  }, [student]);

  async function handleAdd() {
    try {
      setLoading(true);
      const response = await api.post(`students/${student.id}/checkins`);
      const idx = checkIns.length + 1;
      setCheckIns([
        {
          ...response.data,
          index: idx,
          dateFormatted: formatRelative(
            parseISO(response.data.created_at),
            new Date(),
            {
              addSuffix: true,
            }
          ),
        },
        ...checkIns,
      ]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(error.response.data.error);
    }
  }

  return (
    <Background>
      <Container>
        <Button loading={loading} onPress={handleAdd}>
          New Check-in
        </Button>
        <List
          data={checkIns}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => <CheckIn data={item} />}
        />
      </Container>
    </Background>
  );
}

export default withNavigationFocus(CheckIns);
