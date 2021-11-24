
import React from "react";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import AdminScreen from "./screens/AdminScreen";
import { createBrowserHistory } from 'history';
import {dotenv} from 'dotenv';
//require('dotenv').config()
//Sentry 
//import ('dotenv').config();
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


const sentry_dsn=process.env.REACT_APP_SENTRY_DNS;
const sentry_releasenumber=process.env.REACT_APP_RELEASE_NUMBER;
const sentry_environment = process.env.REACT_APP_ENVIRONMENT;
const transcationid=process.env.REACT_APP_TRANSACTION_ID;
  //const sentry_releasenumber ="2.0"
  //const sentry_environment = "DEV"
//  const sentry_dsn="https://2f4d54a4b2b14ce5a176c701dd9a8a4c@o1076633.ingest.sentry.io/6078644"
//  const transcationid=1000
console.log("senti"+ process.env.sentry_dsn);


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
const history = createBrowserHistory();
Sentry.init({
  dsn: sentry_dsn,
  release: sentry_releasenumber,
  environment:sentry_environment ,
  tracesSampleRate: 1.0,
  //integrations: [new Integrations.BrowserTracing()],
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost",  /^\//],

      // Can also use reactRouterV3Instrumentation or reactRouterV4Instrumentation
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      // ... other options
    }),
  ],
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