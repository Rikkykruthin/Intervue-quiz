import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.svg";
import ChatPopover from "../../components/chat/ChatPopover";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await axios.get(`${apiUrl}/poll-history`);
        console.log("Poll history response:", response.data);
        if (response.data.success) {
          setPolls(response.data.polls);
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
        alert("Could not fetch poll history. Make sure the backend server is running.");
      }
    };

    getPolls();
  }, []);

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };
  const handleBack = () => {
    navigate("/teacher-home-page");
  };
  let questionCount = 0;

  return (
    <>
      <ChatPopover />
      <div className="container mt-5 w-50">
      <div className="mb-4 text-left">
        <img
          src={backIcon}
          alt=""
          width={"25px"}
          srcset=""
          style={{ cursor: "pointer" }}
          onClick={handleBack}
        />{" "}
        View <b>Poll History</b>
      </div>
      {polls.length > 0 ? (
        polls.map((poll, pollIndex) => {
          // Calculate total votes from the poll results stored in backend
          const totalVotes = Object.values(poll.results || {}).reduce((sum, count) => sum + count, 0);

          return (
            <div key={poll._id}>
              <div className="pb-3">{`Question ${pollIndex + 1}`}</div>
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="question py-2 ps-2 text-left rounded text-white">
                    {poll.question}?
                  </h6>
                  <div className="list-group mt-4">
                    {poll.options.map((option, index) => {
                      const votes = poll.results ? poll.results[option.text] || 0 : 0;
                      const percentage = calculatePercentage(votes, totalVotes);
                      
                      return (
                        <div
                          key={option.id || index}
                          className="poll-option submitted"
                          style={{
                            background: percentage > 0 
                              ? `linear-gradient(to right, #7765DA ${percentage}%, #ffffff ${percentage}%)`
                              : "#ffffff",
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
                  <div className="text-muted mt-3">
                    <small>Total votes: {totalVotes} | Created: {new Date(poll.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-muted">No polls found. Create some polls to see history here.</div>
      )}
      </div>
    </>
  );
};

export default PollHistoryPage;
