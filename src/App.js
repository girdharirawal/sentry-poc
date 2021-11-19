import React from "react";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import AdminScreen from "./screens/AdminScreen";

//Sentry 

import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const sentry_releasenumber =1.0;
const sentry_environment = "DEV"
//End


//Initialize Sentry with  dsn

// Sentry.init({
//   dsn: "https://4697c127d85848ac9a389e06ea2244b4@o1063374.ingest.sentry.io/6070723",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

Sentry.init({
  dsn: 'https://4697c127d85848ac9a389e06ea2244b4@o1063374.ingest.sentry.io/6070723',
  release: sentry_releasenumber,
  environment:sentry_environment ,
  tracesSampleRate: 1.0,
  // beforeSend(event) {
  //   // Check if it is an exception, if so, show the report dialog
  //   if (event.exception) {
  //     Sentry.showReportDialog();
  //   }
  //   return event;
  // }
});

const transactionId = 1000
Sentry.configureScope(scope => {
  scope.setTag("transaction_id", transactionId);
});

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="grid-container">
            <header>
              <Link to="/">React Shopping Cart</Link>
              <Link to="/admin">Admin</Link>
            </header>
            <main>
              <Route path="/admin" component={AdminScreen} />
              <Route path="/" component={HomeScreen} exact />
            </main>
            {/* <button
                        onClick={throwKnownError1}
                        className="button primary"
                      >
                        Click to generate error
                      </button> */}
            <footer>All right is reserved.</footer>
          </div>
        </BrowserRouter>
      </Provider>
      
    );
  }
}

export default App;

//Sentry 
ReactDOM.render(<App />, document.getElementById("root"));