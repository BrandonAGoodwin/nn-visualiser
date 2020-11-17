// import React, { useState } from 'react';
// import './App.css';
// import NNGraph from './components/NNGraph';
// import styled from 'styled-components';
// import { map } from 'd3';
// import { isPropertyAccessExpression } from 'typescript';
// //import { Button } from '@material-ui/core';

// // const Button = styled.button`
// //   background-color: blue;
// // `

// type Props = {
//   active: boolean;
//   theme: any;
// }

// const theme: any = {
//   blue: {
//     defualt: '#3f51b5',
//     hover: '#283593'
//   }
// }

// const Button = styled.button`
//   background-color: ${props => theme[props.theme].default};
//   color: white;
//   padding: 5px 15px;
//   border-radius: 5px;
//   outline: 0;
//   text-transform: uppercase;
//   margin: 10px 0px;
//   cursor: pointer;
//   box-shadow: 0px 2px 2px lightgray;
//   transition: ease background-color 250ms;
//   &:hover {
//     background-color: ${props => theme[props.theme].hover};
//   }
//   &:disabled {
//     opacity: 0.7;
//     cursor: default;
//   }
// `

// Button.defaultProps = {
//   theme: "blue"
// };

// function clickMe() {
//   alert("You clicked me");
// }

// const ButtonToggle = styled(Button)<Props>`
//   opacity: ${(props) => (props.active ? 1 : 0.7)};
//   /* ${({ active }) => active && `
//     opactity: 1;
//   `} */
// `

// const types = ["Cash", "CC", "Bitcoin"];

// function ToggleGroup() {
//   const [active, setActive] = useState(types[0]);
//   return <div>
//     {types.map(type => <ButtonToggle
//     active = { active === type }
//     onClick = {() => setActive(type)}
//     >{type}</ButtonToggle>)}
//   </div>
// }

// function App() {
//   return (
//     <>
//     <div /* className="App" */>
//       {/* <NNGraph /> */}
//       <Button onClick={clickMe}> Button </Button>
//     </div>
//     <div>
//       <Button> Styled Button </Button>
//     </div>
//     <div>
//       <Button disabled> Disabled Button </Button>
//     </div>
//     <div>
//       <ToggleGroup/>
//     </div>
//     </>
//   );
// }

// export default App;
