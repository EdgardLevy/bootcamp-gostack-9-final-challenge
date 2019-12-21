import styled, {css} from 'styled-components';
import {darken} from 'polished';

export const Button = styled.button`
  padding: 0 15px;
  height: 35px;
  border: 0;
  border-radius: 4px;
  color: #ffffff;
  background: #ee4d64;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: ${darken(0.03, '#ee4d64')};
  }
  > svg {
    margin-right: 5px;
  }
  > span {
    color: #ffffff !important;
    font-weight: bold;
  }
  ${props =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`;

export const PrimaryButton = styled(Button)`
  background: #ee4d64;
  &:hover {
    background: ${darken(0.03, '#ee4d64')};
  }
`;

export const SecondaryButton = styled(Button)`
  background: #c5c5c5;
  &:hover {
    background: ${darken(0.03, '#c5c5c5')};
  }
`;

export const PaginateButton = styled(Button)`
  background: #fff;
  color: #ee4d64;
  &:hover {
    background: ${darken(0.03, '#c5c5c5')};
  }

  ${props =>
    props.selected &&
    css`
      background: #ee4d64;
      color: #fff;
    `}
`;

export const ActionButton = styled(Button)`
  margin-left: 0px;
  background: none;
  &:hover {
    background: ${darken(0.03, '#ee4d64')};
    svg {
      color: #fff !important;
    }
  }
`;
