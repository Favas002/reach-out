import React from "react";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";

const AppContainer = styled.div`
  background-image: url("https://www.transparenttextures.com/patterns/skulls.png");
  height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
