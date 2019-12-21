import styled from 'styled-components';

export const Container = styled.div`
  height: 400px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 25px;
  background: #ffffff;
  > label {
    font-weight: bold;
    color: #444;
  }
  > span {
    height: 200px;
    margin-top: 10px;
    margin-bottom: 10px;
    line-height: 26px;
    font-size: 16px;
    color: #666666;
  }
  #answerForm {
    margin-top: 5px !important;
    padding: 0px !important;
    display: flex;
    flex-direction: column;
    > textarea {
      height: 100px;
      resize: none;
      border-radius: 4px;
      border: 1px solid #eee;
      padding: 15px 15px;
      font-size: 16px;
    }

    > button {
      margin-top: 20px;
      height: 45px;
      font-size: 16px;
      align-items: center;
      align-content: center;
      display: block;
    }
  }
`;
