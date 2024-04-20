import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import PostOptionsModal from "../components/PostOptionsModal";
import { jwtDecode } from "jwt-decode";

export default function ProfilePostCard({ content, postId }) {

  // Number of likes
  const [likes, setLikes] = useState([]);

  // Retrieve stored JWToken
  const token = localStorage.getItem("authToken");

  // Decode the token to retrieve user id
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  const BASE_URL = `https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev`;

  useEffect(() => {

    fetch(`${BASE_URL}/likes/post/${postId}`)
      .then(response => response.json())
      .then(data => {
        setLikes(data);
      })
      .catch(error => console.error('Error: ', error));

  }, [postId]);

  const isLiked = likes.some((like) => like.user_id === userId);

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {

    axios.post(`${BASE_URL}/likes`, {
      user_id: userId,
      post_id: postId,
    })
    .then((response) => {
      setLikes([...likes, {...response.data, likes_id: response.data.id}]);
    })
    .catch((error) => console.error("Error:", error));
    
  };


  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);

    console.log(like);
    console.log(userId);
    console.log(postId);

    if (like) {

      axios
        .put(`${BASE_URL}/likes/${userId}/${postId}`)
        .then(() => {
          // Update the state to reflect the removal of the like
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));

          console.log(likes);
        })
        .catch((error) => console.error("Error:", error));
      
    }
  };
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Row
      className="p-3"
      style={{ borderTop: "1px solid #D3D3D3", borderBottom: "1px solid #D3D3D3" }}
    >
      <Col sm={2}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <div className="d-flex justify-content-between">
          <div>
            <strong className="me-2">Haris</strong>
            <span>@haris.samingan . Apr 16</span>
          </div>
          <Button variant="light" onClick={handleShow}>
            <i className="bi bi-three-dots-vertical"></i>
          </Button>

          <PostOptionsModal show={show} handleClose={handleClose} postId={postId} />
        </div>
        <p>{ content }</p>
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onClick={handleLike}>
            {isLiked ? (
              <i className="bi bi-heart-fill text-danger me-2"></i>
            ) : (
              <i className="bi bi-heart me-2"></i>
            )}
            {likes.length}
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
