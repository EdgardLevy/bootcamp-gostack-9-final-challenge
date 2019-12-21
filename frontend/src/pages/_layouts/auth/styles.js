import styled from 'styled-components';
import {darken} from 'polished';

export const Wrapper = styled.div`
  height: 100%;
  background: #ee4d64;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;
export const Content = styled.div`
  width: 100%;
  max-width: 380px;
  text-align: center;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    background: #fff;
    border-radius: 4px;
    padding: 30px 30px 50px;

    img {
      margin: 30px auto;
      width: 153px;
    }

    label {
      font-weight: bold;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 10px;
      text-align: left;
    }

    input {
      border: 1px solid #eee;

      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      /*color: #fff;*/
      margin: 0 0 10px;
      /*
      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
      */
    }

    span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #ee4d64;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;
      &:hover {
        background: ${darken(0.03, '#ee4d64')};
      }
    }
  }
`;
