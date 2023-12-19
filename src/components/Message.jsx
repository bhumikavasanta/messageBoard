import React from 'react';

const MessageDisplay = (props) => {
  const {
    id,
    message,
    timestamp,
    deleted,
    setDeleted,
  } = props;

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://mapi.harmoney.dev/api/v1/messages/${id}/`, {
        method: 'DELETE',
        headers:
        {
          "Authorization": "ZjQ3OYttl47xpNxj",
        },
      });

      if (response.ok) {
        setDeleted(!deleted);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="message-container">
      <div className="message">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="timestamp">{new Date(timestamp).toLocaleString()}</p>
          <button onClick={handleDelete}>Delete</button>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default MessageDisplay;