import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import CircularDeterminate from "../Spinner";

const SignInPage = () => (
  <div className="container center">
    <h1 className="center blue-grey-text">SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  loading: false
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    document.getElementById('welcomeDiv').style.display = "block";
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="row">
        <div id="welcomeDiv" style={{display:"none"}} >
          <CircularDeterminate />
        </div>
        <form className="col s12" onSubmit={this.onSubmit}>
          <div
            className="card blue-grey darken-1"
            style={{ padding: "20px", color: "white" }}
          >
            <div className="row">
              <div className="input-field col s12 center">
                <input
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  type="text"
                  style={{ color: "white" }}
                  placeholder="Email Address"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12 center">
                <input
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  type="password"
                  style={{ color: "white" }}
                  placeholder="Password"
                />
              </div>
            </div>
            <button
              onClick={this.onSubmit}
              disabled={isInvalid}
              className="btn waves-effect waves-light"
              type="submit"
            >
              Sign In
            </button>
          </div>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignInPage;
