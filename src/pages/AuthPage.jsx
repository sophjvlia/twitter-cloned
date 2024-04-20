import { Row, Col, Image, Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const base_url =
    "https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev";
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (username === "") {
      setUsernameError("Please fill in username");
      hasError = true;
    }

    if (password === "") {
      setPasswordError("Please fill in password");
      hasError = true;
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(password)) {
      setPasswordError("Password must contain at least 8 characters, including at least one digit, one lowercase letter, and one uppercase letter");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      
      const response = await axios.post(`${base_url}/signup`, {
        username,
        password,
      });
      
      alert("User registered successfully");
      
    } catch (error) {

      if (error.response && error.response.data && error.response.data.message === "Username already taken.") {
        setUsernameError("Username is already taken");
      } else {
        console.log(error);
        alert("An error occurred while signing up. Please try again later.");
      }
      
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (username === "") {
      setUsernameError("Please fill in username");
      hasError = true;
    }

    if (password === "") {
      setPasswordError("Please fill in password");
      hasError = true;
    }

     if (hasError) {
       return;
     }

    try {
      
      const response = await axios.post(`${base_url}/login`, { username, password });
      if (response.data && response.data.auth === true && response.data.token) {
        setAuthToken(response.data.token);
        console.log("Login was successful, token saved");
      }
      
    } catch (error) {
      
      if (error.response && error.response.data && error.response.data.message === "Username is incorrect") {
        setUsernameError("Username is incorrect");
      } else if (error.response && error.response.data && error.response.data.message === "Password is incorrect") {
        setPasswordError("Password is incorrect");
      } else {
        alert("An error occurred while logging in. Please try again later.");
      }
      
    }
  };

  const handleClose = () => setModalShow(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>
      <Col sm={6} className="p-4">
        <i
          className="bi bi-twitter"
          style={{ fontSize: 50, color: "dodgerblue" }}
        ></i>

        <p className="mt-5" style={{ fontSize: 64 }}>
          Happening Now
        </p>
        <h2 className="my-5" style={{ fontSize: 31 }}>
          Join Twitter Today.
        </h2>

        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-google"></i> Sign up with Google
          </Button>

          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-apple"></i> Sign up with Apple
          </Button>

          <p style={{ textAlign: "center" }}>or</p>

          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>

          <p style={{ fontSize: "12px" }}>
            By signing up, you agree to the Terms and Service and Privacy Policy
            including Cookie Use.
          </p>

          <p className="mt-5" style={{ fontWeight: "bold" }}>
            Already have an account?
          </p>

          <Button className="rounded-pill" variant="outline-primary" onClick={handleShowLogin}>
            Sign In
          </Button>
        </Col>
        <Modal show={modalShow !== null} onHide={handleClose} animation="false" centered>
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === 'SignUp' ? 'Create your account' : 'Login to your account'}
            </h2>
            <Form className="d-grid gap-2 px-5" onSubmit={modalShow === 'SignUp' ? handleSignUp : handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={handleUsernameChange}
                  type="email"
                  placeholder="Enter username"
                />
                <span className="text-danger">{usernameError}</span>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handlePasswordChange}
                  type="password"
                  placeholder="Password"
                />
                <span className="text-danger">{passwordError}</span>
              </Form.Group>
              <p style={{ fontSize: "12px" }}>
                By signing up, you agree to the Terms and Service and Privacy
                Policy including Cookie Use. SigmaTweets may use your contact
                information, including your email address and phone number for
                purposes outlined in our Privacy Policy, like keeping your
                account secure and personalising our sevices, including ads.
                Learn more. Others will be able to find you by email or phone
                number, when provided, unless you choose otherwise here.
              </p>
              <Button className="rounded-pill" type="submit">
                {modalShow === 'SignUp' ? 'Sign up' : 'Log in' }
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
