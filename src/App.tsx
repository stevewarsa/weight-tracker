import {Redirect, Route, Switch} from "react-router-dom";
import AddEntry from "./pages/AddEntry";
import TopNav from "./components/nav/TopNav";

const App = () => {
  return (
      <>
          <TopNav/>
          <Switch>
              <Route path="/" exact>
                  <Redirect to="/addEntry"/>
              </Route>
              <Route path="/addEntry">
                  <AddEntry/>
              </Route>
          </Switch>
      </>
  );
}

export default App;
