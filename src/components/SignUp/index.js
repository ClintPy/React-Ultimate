import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import CircularDeterminate from "../Spinner";

const SignUpPage = () => (
  <div className="container center">
    <h1 className="center blue-grey-text">SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    document.getElementById("welcomeDiv").style.display = "block";
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
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
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    return (
      <div className="row">
        <div id="welcomeDiv" style={{ display: "none" }}>
          <CircularDeterminate />
        </div>
        <form className="col s12" onSubmit={this.onSubmit}>
          <div className="card blue-grey darken-1" style={{ padding: "20px" }}>
            <div className="row">
              <div className="input-field col s12 center">
                <input
                  name="username"
                  value={username}
                  onChange={this.onChange}
                  type="text"
                  style={{ color: "white" }}
                  placeholder="Full Name"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
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
              <div className="input-field col s12">
                <input
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  type="password"
                  style={{ color: "white" }}
                  placeholder="password"
                />
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  type="password"
                  style={{ color: "white" }}
                  placeholder="Confirm password"
                />
              </div>
            </div>
            <button
              className="btn waves-effect waves-light"
              disabled={isInvalid}
              type="submit"
            >
              Sign Up
            </button>
            {error && (
              <p style={{ color: "white" }}>
                {error.message} 
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Dont't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
