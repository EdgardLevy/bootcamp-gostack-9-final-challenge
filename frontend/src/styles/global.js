import {createGlobalStyle} from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';

export default createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');
  *{
    margin:0;
    padding:0;
    outline:0;
    box-sizing:border-box;
  }
  /**remove a borda azul ao receber o foco */
  *:focus{
    outline:0
  }
  html,body,#root{
    height:100%;
  }
  body{
    -webkit-font-smoothing:antialiased !important;
  }
  body,input,button{
   font: 14px 'Roboto', sans-serif;
  }
  /**resentando configuracoes */
  a {
    text-decoration:none;
  }
  ul {
    list-style:none
  }
  button{
    cursor: pointer;
  }

  .disableInput {
    background: #ddd;
    color: #000;
  }

`;
