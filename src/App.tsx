import {Redirect, Route, Switch} from "react-router-dom";
import AddEntry from "./pages/AddEntry";
import TopNav from "./components/nav/TopNav";
import AllEntries from "./pages/AllEntries";
import Chart from "./pages/Chart";

const App = () => {
    return (
        <>
            <TopNav/>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/addEntry"/>
                </Route>
                <Route path="/addEntry" exact>
                    <AddEntry/>
                </Route>
                <Route path="/allEntries" exact>
                    <AllEntries/>
                </Route>
                <Route path="/chart" exact>
                    <Chart/>
                </Route>
            </Switch>
        </>
    );
}

export default App;
