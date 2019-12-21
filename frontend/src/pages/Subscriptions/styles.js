import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1000px;
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
    }
    button {
      margin-left: 5px;
    }
  }

  form {
    margin-top: 20px;
    background: #fff;
    padding: 30px;
    label {
      color: #444;
      font-weight: bold;
      /* background: blue; */
    }
    > span {
      color: #fb6f91;
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }
    table {
      width: 100%;
      margin-top: 5px;
      td {
        /* background: red; */

        :nth-child(2),
        :nth-child(3),
        :nth-child(4) {
          width: 20%;
          padding-left: 5px;
          input {
            border: 1px solid #eee;
            border-radius: 4px;
            height: 38px;
            padding: 0 15px;
            /* margin: 5px 0 10px; */
            &::placeholder {
              color: rgba(255, 255, 255, 0.7);
            }
          }
        }
      }
    }
  }
  .totalRecords {
    text-align: right;
  }
  .center {
    text-align: center !important;
  }

  .grid {
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

    > div {
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
