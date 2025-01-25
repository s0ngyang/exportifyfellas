import { apiCall } from "helpers";
import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";

export const SongsModal = ({
  showGetSongs,
  handleClose,
  accessToken,
  playlist,
}: {
  showGetSongs: boolean;
  handleClose: () => void;
  accessToken: string;
  playlist: any;
}) => {
  const [songs, setSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    if (showGetSongs) {
      setLoading(true); // Reset loading state
      apiCall(playlist.tracks.href + "?limit=50", accessToken).then(
        (response) => {
          const content = response.data.items.map((item: any) => {
            return `• ${item.track.name} - ${item.track.artists
              .map((a: any) => a.name)
              .join(", ")}`;
          });
          setSongs(content);
          setLoading(false);
        }
      );
    }
  }, [showGetSongs, accessToken, playlist.tracks.href]);

  const handleCopy = () => {
    const formattedText = `Vote _ songs by _\n${songs.join("\n")}`;
    navigator.clipboard.writeText(formattedText).then(() => {
      setShowToast(true); // Show toast after copy
    });
  };

  return (
    <>
      <Modal show={showGetSongs} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Song List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Button className="mb-2" variant="primary" onClick={handleCopy}>
                Copy{"    "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-copy ml-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                  />
                </svg>
              </Button>
              <p style={{ whiteSpace: "pre-wrap" }}>
                Vote _ songs by _{"\n"}
                {songs.join("\n")}
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000} // Toast disappears after 3 seconds
          bg="success"
          autohide
        >
          <Toast.Body>Songs copied to clipboard!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
