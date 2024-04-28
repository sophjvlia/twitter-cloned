import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { Row, Col, Image, Button, Modal, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";

  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password,
      );

      console.log(res.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, username, password);
    } catch (error) {
      console.error(error);

      console.log(error.message);

      if (error.message.includes("auth/invalid-credential")) {
        setError('Invalid username or password');
      }
    }
  };


  const provider = new GoogleAuthProvider();
  
  const handleGoogleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  }


  const handleClose = () => setModalShow(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
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
          <Button className="rounded-pill" variant="outline-dark" onClick={handleGoogleLogin}>
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

          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign In
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation="false"
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp"
                ? "Create your account"
                : "Login to your account"}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={handleUsernameChange}
                  type="email"
                  placeholder="Enter username"
                />
                <span className="text-danger">{usernameError}</span>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  onChange={handlePasswordChange}
                  type="password"
                  placeholder="Password"
                />
                <span className="text-danger">{passwordError}</span>
                <span className="text-danger">{error}</span>
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
                {modalShow === "SignUp" ? "Sign up" : "Log in"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
