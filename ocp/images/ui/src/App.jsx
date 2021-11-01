import {Component} from 'react';
import Main from "./components/Main";
import Store from "./Store";

class App extends Component {

    render() {
        return (
            <Store>
                <Main/>
            </Store>
        )
    }
}

export default App;
