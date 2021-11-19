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

const sentry_releasenumber =process.env.RELEASE_NUMBER
const sentry_environment = process.env.ENVIRONMENT
const sentry_dsn=process.env.SENTRY_DNS;
const transcationid=process.env.TRANSACTION_ID;

//End


//Initialize Sentry with  dsn

// Sentry.init({
//   dsn: "",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

Sentry.init({
  dsn: sentry_dsn,
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

Sentry.configureScope(scope => {
  scope.setTag("transaction_id", transcationid);
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
            <button
                        onClick={() => Sentry.showReportDialog()}
                        className="button primary"
                      >
                        Contact us
                      </button>
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