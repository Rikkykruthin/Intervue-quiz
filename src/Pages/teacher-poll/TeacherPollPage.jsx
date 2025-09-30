import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import "./TeacherPollPage.css";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const TeacherPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");

    // Don't proceed if no username
    if (!username) {
      console.error("No username found in sessionStorage");
      navigate("/");
      return;
    }

    const handleConnect = () => {
      console.log("Teacher poll page connected to backend");
      // Join as teacher
      socket.emit('joinRoom', {
        username: username,
        role: 'teacher'
      });
    };

    const handlePollCreated = (pollData) => {
      console.log("Poll created received:", pollData);
      if (pollData && pollData.question && pollData.options) {
        setPollQuestion(pollData.question);
        setPollOptions(pollData.options);
        setVotes(pollData.results || {});
      }
    };

    const handlePollResults = (updatedVotes) => {
      console.log("Poll results received:", updatedVotes);
      if (updatedVotes && typeof updatedVotes === 'object') {
        setVotes(updatedVotes);
        const total = Object.values(updatedVotes).reduce((a, b) => (a || 0) + (b || 0), 0);
        setTotalVotes(total);
      }
    };

    const handleConnectError = (error) => {
      console.error("Socket connection failed:", error);
    };

    // Set up socket listeners
    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on("pollCreated", handlePollCreated);
    socket.on("pollResults", handlePollResults);

    // If already connected, join immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off("pollCreated", handlePollCreated);
      socket.off("pollResults", handlePollResults);
    };
  }, [navigate]);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };
  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };
  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      <button
        className="btn rounded-pill ask-question poll-history px-4 m-2"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="" />
        View Poll history
      </button>
      <br />
      <div className="container mt-5 w-50">
        <h3 className="mb-4 text-center">Poll Results</h3>

        {pollQuestion && (
          <>
            <div className="card">
              <div className="card-body">
                <h6 className="question py-2 ps-2 text-left rounded text-white">
                  {pollQuestion} ?
                </h6>
                <div className="list-group mt-4">
                  {Array.isArray(pollOptions) && pollOptions.map((option, index) => {
                    if (!option || !option.text) return null;

                    const percentage = calculatePercentage(votes[option.text] || 0);

                    return (
                      <div
                        key={option.id || index}
                        className="poll-option submitted"
                        style={{
                          background: `linear-gradient(to right, #7765DA ${percentage}%, #ffffff ${percentage}%)`,
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          padding: "15px",
                          margin: "8px 0",
                          transition: "all 0.3s ease"
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="option-number">
                            {index + 1}
                          </div>
                          <span className="option-text">
                            {option.text}
                          </span>
                          <span className="option-percentage">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <button
                className="btn rounded-pill ask-question px-4 m-2"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        )}

        {!pollQuestion && (
          <div className="text-muted">
            Waiting for the teacher to start a new poll...
          </div>
        )}
        <ChatPopover />
      </div>
    </>
  );
};

export default TeacherPollPage;
