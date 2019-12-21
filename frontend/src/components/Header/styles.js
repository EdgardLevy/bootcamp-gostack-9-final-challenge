import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;
export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    display: flex;
    align-items: center;
    span {
      color: #ee4d64;
      font-weight: bold;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }
    img {
      margin-right: 20px;
      height: 24px;
    }
    a {
      font-weight: bold;
      color: #999;
      margin-right: 20px;
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;
export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;
  > div {
    text-align: right;
    margin-right: 10px;
    strong {
      display: block;
      color: #333;
    }
    button {
      display: block;
      margin-top: 2px;
      font-size: 14px;
      color: #ee4d64;
      border: none;
      background: none;
    }
  }
`;
