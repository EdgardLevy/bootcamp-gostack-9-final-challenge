import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;

  header {
    display: flex;
    padding: 15px 0;
    justify-content: space-between;

    strong {
      font-size: 24px;
    }

    aside {
      display: flex;
    }

    input {
      margin-left: 5px;
      padding-left: 15px;
    }
    button {
      margin-left: 5px;
    }
  }

  form {
    content {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      background: #fff;
      padding: 30px;

      input {
        border: 1px solid #eee;
        border-radius: 4px;
        height: 44px;
        padding: 15px 15px;

        margin: 0 0 10px;
        &::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
      }
      label {
        color: #444;
        font-weight: bold;
      }
      input {
        margin-top: 5px;
      }
      > span {
        color: #fb6f91;
        align-self: flex-start;
        margin: 0 0 10px;
        font-weight: bold;
      }
      div {
        > span {
          color: #fb6f91;
          align-self: flex-start;
          margin: 0 0 10px;
          font-weight: bold;
        }
        display: flex;
        div {
          flex: 1;

          display: flex;
          flex-direction: column;
        }

        :nth-child(2) {
          margin-left: 15px;
          margin-right: 15px;
        }
      }
    }
  }
  .totalRecords {
    text-align: right;
  }
  .center {
    text-align: center;
  }

  table {
    margin-top: 5px;
    border-radius: 4px;
    width: 100%;

    padding: 30px;
    background: #fff;
    line-height: 20px;
    font-size: 16px;

    thead {
      tr {
        color: #444;
        th {
          text-align: left;
          font-weight: bold;
        }
      }
    }

    tr {
      height: 40px;
      color: #666;
      & + tr {
        td {
          border-top: 1px solid #eee;
        }
      }
    }
  }

  .pagination {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    div {
      display: flex;
      flex-direction: column;
      margin-top: 3px;
      > div {
        display: flex;
        flex-direction: row;
      }
    }
    > button {
      border: 0;
      padding: 10px;
      font-weight: bold;
    }
  }
`;
