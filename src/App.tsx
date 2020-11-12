import React, { useState } from 'react';
import './App.css';
import NNGraph from './components/NNGraph';
import styled from 'styled-components';
import { map } from 'd3';
import { isPropertyAccessExpression } from 'typescript';
import MainPage from "./components/MainPage";

function App() {
  return (
    <MainPage/>
  );
}

export default App;
