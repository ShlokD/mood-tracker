import { render } from "preact";
import AppContextProvider from "./app-context.jsx";
import { App } from "./app.jsx";
import DBContextProvider from "./db-context";
import "./index.css";

const Application = () => {
  return (
    <DBContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </DBContextProvider>
  );
};

render(<Application />, document.getElementById("app"));
