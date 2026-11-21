import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return <h1>bauhaus-react</h1>;
}

createRoot(document.getElementById("root")!).render(<App />);
