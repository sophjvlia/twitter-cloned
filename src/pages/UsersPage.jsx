import { Navbar, Container, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import axios from "axios";

const UsersPage = () => {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();
  const base_url =
    "https://9e306cfc-24b8-4ff2-a215-5fae80eb0507-00-2q4g0edn44be2.pike.replit.dev";
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken("");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${base_url}/users`);
        setUsers(response.data.users);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
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

        setCurrentUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching current username:", error.message);
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUserId && users) {
          const userIds = users.map((user) => user.id);

          const response = await axios.post(
            `${base_url}/check-following`,
            { currentUserId, userIds },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          const updatedUsers = users.map((user) => {
            const matchingUser = response.data.find(
              (u) => u.userId === user.id,
            );
            if (matchingUser) {
              return { ...user, isFollowing: matchingUser.isFollowing };
            }
            return user;
          });

          setUsers(updatedUsers);
          setIsLoading(false);
        } else {
          console.log("currentUserId and users are not available");
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const handleFollowToggle = async (userId) => {
    try {
      // Send a request to the server to toggle the follow status
      const response = await axios.post(
        `${base_url}/toggle-follow`,
        { currentUserId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(response.data);
      // Update the isFollowing property locally based on the response
      const updatedUsers = users.map((user) => {
        if (user.id === response.data.userId) {
          return { ...user, isFollowing: response.data.isFollowing };
        }
        return user;
      });

      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error toggling follow:", error.message);
    }
  };

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">
            <i
              className="bi bi-twitter"
              style={{ fontSize: 30, color: "dodgerblue" }}
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
        <h2>All Users</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {Array.isArray(users) && users.length > 0 ? (
              <ul className="list-unstyled mt-4">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="col-12 mb-2 d-flex justify-content-between align-items-center"
                  >
                    <li>{user.username} </li>
                    <Button
                      variant="primary"
                      onClick={() => handleFollowToggle(user.id)}
                      style={{ width: "100px" }}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </Button>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default UsersPage;
