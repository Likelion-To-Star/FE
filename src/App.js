import Main from "./components/main/Main.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './assets/scss/styles.scss';

function App() {
  return (
    <BrowserRouter>
            <Routes>
                <Route path='/' element={<Main/>} />
            </Routes>
        </BrowserRouter>
  );
}

export default App;
