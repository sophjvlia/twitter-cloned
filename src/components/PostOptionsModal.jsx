import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function PostOptionsModal({ show, handleClose, postId }) {
  const [postContent, setPostContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {

    fetch(`https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev/posts/${postId}`)
    .then(response => response.json())
    .then(data => setPostContent(data.post.content))
    .catch(error => console.error('Error: ', error));
    
  }, []);

  function handleEdit() {
    setShowEditModal(true);
    handleClose();
  }

  function handleDelete() {

    axios
    .delete(`https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev/posts/${postId}`)
    .then((response) => {
      console.log("Deleted successfully ", response.data);
      handleClose();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
    
  }

  const handleSave = () => {

    // Prepare post data
    const post_data = {

      content: postContent,

    }

    // API call 
    axios
      .put(`https://38f2b79d-47ac-4054-85cb-7ad284aed8c0-00-2ky1q519xwcxq.riker.replit.dev/posts/${postId}`, post_data)
      .then((response) => {
        console.log('Success: ', response.data);
        setShowEditModal(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error: ', error);
      })

  }

  return (

    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>More Options</Modal.Header>

        <Modal.Body>
          <Button onClick={handleEdit}>Edit Tweet</Button>
          <br />
          <Button className="mt-2" onClick={handleDelete}>Delete Tweet</Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>Edit Tweet</Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="postContent">
              <Form.Control 
                placeholder="What is happening?!"
                as="textarea"
                rows={3}
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={handleSave}
          >
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </>

  )


}
