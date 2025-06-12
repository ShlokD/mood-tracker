import { render } from "preact";
import AppContextProvider from "./app-context";
import App from "./app";
import DBContextProvider from "./db-context";
import "./index.css";

export const Application = () => {
  return (
    <DBContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </DBContextProvider>
  );
};

render(<Application />, document.getElementById("app"));
