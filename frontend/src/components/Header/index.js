import React from 'react';
import {Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {signOut} from '~/store/modules/auth/actions';

import logo from '~/assets/logo_header.png';

import {Container, Content, Profile} from './styles';

export default function Header() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GymPoint" />
          <span>GYMPOINT</span>
          <Link to="/students">STUDENTS</Link>
          <Link to="/plans">PLANS</Link>
          <Link to="/subscriptions">SUBSCRIPTIONS</Link>
          <Link to="/helporders">HELP ORDERS</Link>
        </nav>
        <aside>
          <Profile>
            <div>
              <strong>{profile.name}</strong>
              <button type="button" onClick={handleLogout}>
                logout
              </button>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
