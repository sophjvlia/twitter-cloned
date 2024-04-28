import axios from "axios";
import { useState, useContext } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import PostOptionsModal from "../components/PostOptionsModal";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { likePost, removeLikeFromPost } from "../features/posts/postsSlice";
import { AuthContext } from "./AuthProvider";

export default function ProfilePostCard({ post }) {

  const { content, id: postId } = post;
  const [likes, setLikes] = useState(post.likes || []);
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const isLiked = likes.includes(userId);

  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {

    setLikes([...likes, userId]);
    dispatch(likePost({ userId, postId }));
  };


  const removeFromLikes = () => {

    setLikes(likes.filter((id) => id !== userId));
    dispatch(removeLikeFromPost({ userId, postId }));
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
