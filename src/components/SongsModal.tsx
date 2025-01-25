import { apiCall } from "helpers";
import React, { useEffect, useState } from "react";

import { Button, Modal, Spinner } from "react-bootstrap";

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
      alert("Songs copied to clipboard!");
    });
  };

  return (
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
              Copy to Clipboard
            </Button>
            <p style={{ whiteSpace: "pre-wrap" }}>
              Vote _ songs by _{"\n"}
              {songs.join("\n")}
            </p>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
