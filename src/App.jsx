import { Route, Routes } from "react-router-dom"
import HOME from "./pages/HOME"

const App = () => {
  return (
  <>
  <Routes>
      <Route path="/" element={<HOME />} />
  </Routes>
  </>
  )
}

export default App
