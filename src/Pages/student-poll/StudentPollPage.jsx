import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import "./StudentPollPage.css";
import stopwatch from "../../assets/stopwatch.svg";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import stars from "../../assets/spark.svg";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const StudentPollPage = () => {
  const [votes, setVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [pollId, setPollId] = useState("");
  const [kickedOut, setKickedOut] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    
    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    const handleConnect = () => {
      console.log("Student connected to backend server");
      
      // Join as student
      if (username) {
        socket.emit('joinRoom', {
          username: username,
          role: 'student'
        });
      }
    };

    // Handle connection
    if (socket.on) {
      socket.on('connect', handleConnect);
      socket.on("kickedOut", handleKickedOut);
      
      // If already connected, join immediately
      if (socket.connected && username) {
        socket.emit('joinRoom', {
          username: username,
          role: 'student'
        });
      }
    }

    return () => {
      if (socket.off) {
        socket.off('connect', handleConnect);
        socket.off("kickedOut", handleKickedOut);
      }
    };
  }, [navigate]);

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <>
      <ChatPopover />
      {kickedOut ? (
        <div>kicked</div>
      ) : (
        <>
          {" "}
          {pollQuestion === "" && timeLeft === 0 && (
            <div className="d-flex justify-content-center align-items-center vh-100 w-75  mx-auto">
              <div className="student-landing-container text-center">
                <button className="btn btn-sm intervue-btn mb-5">
                  <img src={stars} className="px-1" alt="" />
                  Intervue Poll
                </button>
                <br />
                <div
                  className="spinner-border text-center spinner"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="landing-title">
                  <b>Wait for the teacher to ask questions..</b>
                </h3>
              </div>
            </div>
          )}
          {pollQuestion !== "" && (
            <div className="container mt-5 w-50">
              <div className="d-flex align-items-center mb-4">
                <h5 className="m-0 pe-5">Question</h5>
                <img
                  src={stopwatch}
                  width="15px"
                  height="auto"
                  alt="Stopwatch"
                />
                <span className="ps-2 ml-2 text-danger">{timeLeft}s</span>
              </div>
              <div className="card">
                <div className="card-body">
                  <h6 className="question py-2 ps-2 float-left rounded text-white">
                    {pollQuestion}?
                  </h6>
                  <div className="list-group mt-4">
                    {pollOptions.map((option, index) => {
                      const percentage = submitted ? calculatePercentage(votes[option.text] || 0) : 0;
                      const isSelected = selectedOption === option.text;
                      
                      return (
                        <div
                          key={option.id}
                          className={`poll-option-container ${
                            isSelected && !submitted ? "selected" : ""
                          }`}
                          style={{
                            position: "relative",
                            cursor: submitted || timeLeft === 0 ? "not-allowed" : "pointer",
                            border: isSelected && !submitted ? "2px solid #7765DA" : "1px solid #e0e0e0",
                            borderRadius: "8px",
                            margin: "8px 0",
                            transition: "all 0.3s ease",
                            overflow: "hidden",
                            backgroundColor: "#ffffff"
                          }}
                          onClick={() => {
                            if (!submitted && timeLeft > 0) {
                              handleOptionSelect(option.text);
                            }
                          }}
                        >
                          {/* Purple progress background */}
                          {submitted && (
                            <div
                              className="progress-fill"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: `${percentage}%`,
                                backgroundColor: "#7765DA",
                                transition: "width 0.5s ease",
                                zIndex: 1
                              }}
                            />
                          )}
                          
                          {/* Main content with black text */}
                          <div 
                            className="option-content"
                            style={{
                              position: "relative",
                              zIndex: 2,
                              padding: "15px",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <div className="option-number">
                              {index + 1}
                            </div>
                            <span className="option-text">
                              {option.text}
                            </span>
                            {submitted && (
                              <span className="option-percentage">
                                {Math.round(percentage)}%
                              </span>
                            )}
                          </div>

                          {/* White text overlay (only visible over purple area) */}
                          {submitted && (
                            <div 
                              className="option-content white-text-overlay"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 3,
                                padding: "15px",
                                display: "flex",
                                alignItems: "center",
                                width: `${percentage}%`,
                                overflow: "hidden",
                                whiteSpace: "nowrap"
                              }}
                            >
                              <div 
                                className="option-number"
                                style={{
                                  backgroundColor: "#ffffff",
                                  color: "#7765DA",
                                  border: "2px solid #7765DA"
                                }}
                              >
                                {index + 1}
                              </div>
                              <span 
                                className="option-text"
                                style={{ color: "#ffffff" }}
                              >
                                {option.text}
                              </span>
                              <span 
                                className="option-percentage"
                                style={{ color: "#ffffff" }}
                              >
                                {Math.round(percentage)}%
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {!submitted && selectedOption && timeLeft > 0 && (
                <div className="d-flex  justify-content-end align-items-center">
                  <button
                    type="submit"
                    className="btn continue-btn my-3 w-25"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-5">
                  <h6 className="text-center">
                    Wait for the teacher to ask a new question...
                  </h6>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StudentPollPage;
