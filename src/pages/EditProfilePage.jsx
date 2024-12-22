import { Navbar, Container, Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useLocalStorage from "use-local-storage";
import axios from "axios";

const EditProfilePage = () => {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();

  const base_url =
    "https://9e306cfc-24b8-4ff2-a215-5fae80eb0507-00-2q4g0edn44be2.pike.replit.dev";

  const [currentUsername, setCurrentUsername] = useState("");
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      try {
        let authToken = localStorage.getItem("authToken");

        if (!authToken) {
          throw new Error("Token not found");
        }

        authToken = authToken.replace(/^"(.*)"$/, "$1");

        const response = await axios.get(`${base_url}/username`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setCurrentUsername(response.data.username);
        console.log(currentUsername);
      } catch (error) {
        console.error("Error fetching current username:", error.message);
      }
    };

    fetchCurrentUsername();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${base_url}/username`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  };

  const handleCancel = () => {
    // Navigate back to the profile page
    navigate("/profile");
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    setUsernameMessage("");

    try {
      // Check username availability
      const result = await checkUsernameAvailability({ username: newUsername });

      // Update the username message based on availability
      if (result.exists) {
        setUsernameMessage("Username already taken.");
      } else {
        setUsernameMessage("Username available");
      }
    } catch (error) {
      console.error("Error checking username availability:", error.message);
      setUsernameMessage(
        "An error occurred while checking username availability",
      );
    }
  };

  const checkUsernameAvailability = async (formData) => {
    try {
      const { username } = formData;
      const response = await axios.post(`${base_url}/check-username`, {
        username,
      });
      return response.data;
    } catch (error) {
      console.error("Error checking username availability:", error.message);
      return {
        exists: false,
        message: "An error occurred while checking username availability",
      };
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      // Create a new FormData object from the form
      const formData = new FormData(e.target);

      // Send the form data to the server
      const response = await axios.post(
        `${base_url}/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(response.data);

      if (response.ok) {
        fetchUserDetails();
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleLogout = () => {
    setAuthToken("");
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

      <Container className="mt-3">
        <h2>Edit Profile</h2>
        <Form onSubmit={handleUpdateProfile}>
          <Form.Control
            type="hidden"
            id="currentUsername"
            name="currentUsername"
            value={currentUsername}
          />

          <Form.Group controlId="profileImage" className="mb-3">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" name="profileImage" />
          </Form.Group>

          <Form.Group controlId="username" className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              onChange={handleUsernameChange}
              name="username"
              value={username}
            />
            <span
              style={{
                color: usernameMessage.includes("taken") ? "red" : "green",
              }}
            >
              {usernameMessage}
            </span>
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter short description"
              name="description"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          <Button variant="secondary" className="ms-2" onClick={handleCancel}>
            Cancel
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default EditProfilePage;
