import React from 'react';

import {Container, Title, Time} from './styles';

export default function CheckIn({data}) {
  return (
    <Container>
      <Title>Check In #{data.index}</Title>
      <Time>{data.dateFormatted}</Time>
    </Container>
  );
}
