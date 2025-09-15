// App.jsx
import { Provider } from "react-redux";
import store from "./redux_setup/store";
import RoutesConfig from "./routes/router";
import { InventoryProvider } from "./contexts/InventoryContext.jsx";

function App() {
  return (
    <Provider store={store}>
      <InventoryProvider>
        <RoutesConfig />
      </InventoryProvider>
    </Provider>
  );
}

export default App;
