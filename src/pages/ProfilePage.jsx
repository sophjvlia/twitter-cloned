import { getAuth } from "firebase/auth";
import { Navbar, Container, Button, Row } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import ProfileSideBar from "../components/ProfileSideBar";
import ProfileMidBody from "../components/ProfileMidBody";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // check if current user is logged in
  if (!currentUser) {
    navigate("/login"); // redirect to login if user not logged in
  }
  
  // const [user, setUser] = useState("");
  // const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  // const base_url =
  //   "https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev";

  // useEffect(() => {
  //   if (!authToken) {
  //     navigate("/login");
  //   } else {
  //     fetchUserDetails();
  //   }
  // }, [authToken, navigate]);

  // const fetchUserDetails = async () => {
  //   try {
  //     const response = await fetch(`${base_url}/username`, {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const userData = await response.json();
  //       setUser(userData);
  //     } else {
  //       throw new Error("Failed to fetch user details");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user details:", error.message);
  //   }
  // };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">
            <i
              className="bi bi-twitter"
              style={{ fontSize: 30, color: "dodgerblue " }}
            ></i>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Link to="/users">
              <Button variant="primary" className="me-2">
                Users
              </Button>
            </Link>
            <Link to="/edit-profile">
              <Button variant="primary" className="me-2">
                Edit Profile
              </Button>
            </Link>
            <Button varaint="primary" onClick={handleLogout}>
              Log out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* <Container className="mx-2">
        {user && (
          <>
            <h2 className="mt-3">Your profile</h2>
            <div className="mt-4">
              {user.profileimage && (
                <img
                  src={user.profileimage}
                  alt="Profile"
                  className="square-image"
                />
              )}
              <h6>{user.username}</h6>
              <h6>{user.description}</h6>
            </div>
          </>
        )}
      </Container> */}

      <Container className="mx-0">
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  );
}
