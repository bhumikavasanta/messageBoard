import React, { useEffect, useState } from 'react';
import MessageDisplay from './Message';
import './Styles.css';

const MainContent = () => {
  const [data, setData] = useState([]);
  const [msgText, setMsgText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleted, setDeleted] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageEmptyError, setMessageEmptyError] = useState(false);
  const [postSuccessful, setPostSuccessful] = useState(false);
  const [sortBy, setSortBy] = useState(false);
  const itemsPerPage = 6;

  // Function to get the data
  const getData = async () => {
    try {
      const response = await fetch('https://mapi.harmoney.dev/api/v1/messages/', {
        method: 'GET',
        headers: {
          "Authorization": "ZjQ3OYttl47xpNxj",
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response?.json();
      sortBy && result?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to post a message
  const handleSubmit = async () => {
    if (msgText === "") {
      setMessageEmptyError(true);
    } else {
      try {
        const response = await fetch('https://mapi.harmoney.dev/api/v1/messages/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "ZjQ3OYttl47xpNxj",
          },
          body: JSON.stringify({ text: msgText }),
        });

        if (response.ok) {
          setPostSuccessful(true);
          getData();
          setMsgText("");
        } else {
          console.error('Failed to submit data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Function to delete message
  const handleDelete = async (deleteId) => {
    console.log("Delete");
    try {
      const response = await fetch(`https://mapi.harmoney.dev/api/v1/messages/${deleteId}/`, {
        method: 'DELETE',
        headers:
        {
          "Authorization": "ZjQ3OYttl47xpNxj",
        },
      });

      if (response.ok) {
        getData();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Funnction to delete all messages
  const deleteAllMessages = async () => {
    try {
      for (const message of data) {
        await handleDelete(message?.id);
      }
      setData([]);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting all messages:', error);
    }
  };

  // Function to change page number
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getData();
  }, [deleted, sortBy]);

  const handleEnterPress = (e) => {
    if(e.keyCode===13) {
      handleSubmit();
    }
  };

  // Calculate pagination boundaries
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = data?.slice(startIndex, endIndex);

  return (
    <main>
      <p className="type-text">Type something in the box below and then hit post.</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          onKeyDown={handleEnterPress}
        />
        <button onClick={handleSubmit}>Post</button>
        <button onClick={data?.length > 1 ? () => setShowConfirmation(true) : deleteAllMessages}>Delete All</button>
        <button onClick={() => setSortBy(true)}>Sort by Timestamp</button>
      </div>
      {
        data?.length === 0 && <div className="empty-message">No Messages Available</div>
      }
      {
        sortBy && <div className="sort-by">Sorted By Timestamp (New First)</div>
      }
      {displayedData?.map((msg) => (
        <MessageDisplay
          key={msg?.id}
          id={msg?.id}
          message={msg?.text}
          timestamp={msg?.timestamp}
          deleted={deleted}
          setDeleted={setDeleted}
        />
      ))}
      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete all messages?</p>
            <button onClick={deleteAllMessages}>Yes</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        </div>
      )}
      {messageEmptyError && (
        <div className="modal">
          <div className="modal-content">
            <p>You can't enter empty messages.</p>
            <button onClick={() => setMessageEmptyError(false)}>Okay</button>
          </div>
        </div>
      )}
      {postSuccessful && (
        <div className="modal">
          <div className="modal-content">
            <p>Message added successfully.</p>
            <button onClick={() => setPostSuccessful(false)}>Okay</button>
          </div>
        </div>
      )}
      {/* Pagination controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(data?.length / itemsPerPage) }, (_, index) => index + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </main>
  );
}

export default MainContent;
