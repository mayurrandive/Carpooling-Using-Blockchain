import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AdministratorDashboardRequests from "./components/javascripts/administrator-dashboard-requests";
import AdministratorDashboardUserRegistration from "./components/javascripts/user-registration";
import AdministratorDashboardUserApplicationStatus from "./components/javascripts/user-application-status";
import AdministratorDashboardPassengers from "./components/javascripts/administrator-dashboard-enrolled-passengers";
import HomePageFinal from "./components/javascripts/HomePageFinal";
import Inbox from "./components/javascripts/RideInbox";
import LoginPage from "./components/testing-javascripts/Login.jsx";
import ProfilePictureEditor from "./components/testing-javascripts/profile-picture-editor";
import MainMap from "./components/testing-javascripts/mainMap.jsx";
import RideHistory from "./components/javascripts/RideHistory.jsx";
import DashboardPage from "./components/testing-javascripts/Dashboard.jsx";
import CurrentRide from "./components/javascripts/CurrentRide.jsx";
import ViewAllRides from "./components/testing-javascripts/view-all-rides.jsx";
import MyCurrentRidesBooked from "./components/javascripts/my-current-rides-booked.jsx";

function App2() {
  return (
    <Router className="App">
      <Switch>
        <Route exact path="/" component={HomePageFinal} />
        <Route
          exact
          path="/commute-io-verification-portal"
          component={AdministratorDashboardUserApplicationStatus}
        />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/pfp" component={ProfilePictureEditor} />
        <Route path="/viewallrides/:passengerID" component={ViewAllRides} />
        <Route path="/dashboard/:passengerID" component={DashboardPage} />
        <Route
          path="/myinprogressrides/:passengerID"
          component={MyCurrentRidesBooked}
        />
        <Route path="/ridehistory/:passengerID" component={RideHistory} />
        <Route path="/startaride/:passengerID" component={MainMap} />
        <Route
          path="/viewselectedupcomingride/:passengerID/:rideID"
          component={CurrentRide}
        />
        <Route
          path="/new-application-for-passenger"
          component={AdministratorDashboardUserRegistration}
        />
        <Route path="/user-login" component={LoginPage} />
        <Route
          path="/administrator-login"
          component={AdministratorDashboardPassengers}
        />
        <Route
          path="/enrolled-passengers"
          component={AdministratorDashboardPassengers}
        />
        <Route
          path="/passenger-requests"
          component={AdministratorDashboardRequests}
        />
        <Route path="/enterRideInbox/:passengerID" component={Inbox} />
      </Switch>
    </Router>
  );
}
export default App2;
