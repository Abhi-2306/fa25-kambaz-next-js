/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import * as client from "../../Quizzes/client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  const isFaculty = currentUser?.role === "FACULTY";
  const isStudent = currentUser?.role === "STUDENT";

  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
        const data = await client.findQuizById(qid as string);
        setQuiz(data);
        
        if (isStudent) {
          try {
            const attemptsData = await client.getAttempts(qid as string);
            setAttempts(attemptsData);
            
            if (attemptsData.length > 0) {
              const latest = await client.getLatestAttempt(qid as string);
              setLatestAttempt(latest);
            }
          } catch (error) {
            console.error("Error fetching attempts:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndAttempts();
  }, [qid, isStudent]);

  const handlePublishToggle = async () => {
    try {
      await client.updateQuiz(qid as string, { published: !quiz.published });
      setQuiz({ ...quiz, published: !quiz.published });
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const canTakeQuiz = () => {
    if (!quiz) return false;
    if (!quiz.published) return false;
    if (!quiz.multipleAttempts && attempts.length > 0) return false;
    
    if (quiz.multipleAttempts && attempts.length >= quiz.howManyAttempts) return false;
    
    return true;
  };

  const getAttemptsRemaining = () => {
    if (!quiz.multipleAttempts) {
      return attempts.length > 0 ? 0 : 1;
    }
    return Math.max(0, quiz.howManyAttempts - attempts.length);
  };

  const getHighestScore = () => {
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map(a => a.score || 0));
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleString();
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return "-";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz details...</div>;
  }

  if (!quiz) {
    return <div className="container mt-4">Quiz not found</div>;
  }

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
  const highestScore = getHighestScore();
  const attemptsRemaining = getAttemptsRemaining();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center mb-4 gap-2">
        {isFaculty && (
          <>
            <button
              className={`btn ${quiz.published ? "btn-warning" : "btn-success"}`}
              onClick={handlePublishToggle}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </button>
            <Link
              href={`/Courses/${cid}/Quizzes/${qid}/preview`}
              className="btn btn-secondary"
            >
              Preview
            </Link>
            <Link
              href={`/Courses/${cid}/Quizzes/${qid}/edit`}
              className="btn btn-secondary"
            >
              <FaEdit className="me-2" />
              Edit
            </Link>
          </>
        )}
        {isStudent && quiz.published && canTakeQuiz() && (
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}/take`}
            className="btn btn-danger"
          >
            {attempts.length > 0 ? "Retake Quiz" : "Start Quiz"}
          </Link>
        )}
        {isStudent && quiz.published && !canTakeQuiz() && (
          <button className="btn btn-secondary" disabled>
            No Attempts Remaining
          </button>
        )}
      </div>

      <hr />

      <h2>{quiz.title}</h2>
      
      {isStudent && quiz.published && (
        <div className="row mt-3 mb-4">
          <div className="col-md-8">
            <div className="alert alert-info">
              <div className="row">
                <div className="col-md-4">
                  <strong>Status:</strong> {attempts.length === 0 ? "Not Started" : "In Progress"}
                </div>
                <div className="col-md-4">
                  <strong>Attempts Remaining:</strong> {attemptsRemaining}
                </div>
                <div className="col-md-4">
                  <strong>Best Score:</strong> {highestScore !== null ? `${highestScore}/${totalPoints}` : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-md-8">
          <table className="table">
            <tbody>
              <tr>
                <td className="text-end fw-bold" style={{ width: "40%" }}>
                  Quiz Type
                </td>
                <td>{quiz.quizType}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Points</td>
                <td>{totalPoints}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Assignment Group</td>
                <td>{quiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Shuffle Answers</td>
                <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Time Limit</td>
                <td>{quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "None"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Multiple Attempts</td>
                <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
              </tr>
              {quiz.multipleAttempts && (
                <tr>
                  <td className="text-end fw-bold">How Many Attempts</td>
                  <td>{quiz.howManyAttempts}</td>
                </tr>
              )}
              <tr>
                <td className="text-end fw-bold">Show Correct Answers</td>
                <td>
                  {quiz.showCorrectAnswers === "immediately" 
                    ? "Immediately" 
                    : quiz.showCorrectAnswers === "after_due" 
                    ? "After Due Date" 
                    : "Never"}
                </td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Access Code</td>
                <td>{quiz.accessCode ? "Required" : "None"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">One Question at a Time</td>
                <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Webcam Required</td>
                <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">
                  Lock Questions After Answering
                </td>
                <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
          
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Due</th>
                <th>Available From</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(quiz.dueDate)}</td>
                <td>{formatDate(quiz.availableDate)}</td>
                <td>{formatDate(quiz.untilDate)}</td>
              </tr>
            </tbody>
          </table>
          {isStudent && attempts.length > 0 && (
            <div className="mt-4">
              <h4>Attempt History</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Attempt</th>
                    <th style={{ width: "30%" }}>Time</th>
                    <th style={{ width: "25%" }}>Score</th>
                    <th style={{ width: "25%" }}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt, index) => (
                    <tr key={attempt._id || index} className={latestAttempt?._id === attempt._id ? "table-primary" : ""}>
                      <td>
                        {latestAttempt?._id === attempt._id && (
                          <span className="badge bg-primary me-2">LATEST</span>
                        )}
                        Attempt {index + 1}
                      </td>
                      <td>{formatTime(attempt.timeUsed)}</td>
                      <td>
                        <strong>{attempt.score} out of {totalPoints}</strong>
                        <div className="progress mt-1" style={{ height: "5px" }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${(attempt.score / totalPoints) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        {attempt.createdAt 
                          ? new Date(attempt.createdAt).toLocaleString() 
                          : "N/A"}
                        {attempt.autoSubmitted && (
                          <div>
                            <small className="text-danger">Auto-submitted (Time expired)</small>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {highestScore !== null && (
                <div className="alert alert-success mt-3">
                  <strong>Your Best Score: </strong>
                  {highestScore} out of {totalPoints} ({Math.round((highestScore / totalPoints) * 100)}%)
                </div>
              )}
            </div>
          )}
          <div className="mt-4">
            <h5>Questions: {quiz.questions?.length || 0}</h5>
            {quiz.questions?.length > 0 && (
              <ul className="list-group">
                {quiz.questions.map((q: any, index: number) => (
                  <li
                    key={q._id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {index + 1}. {q.title || "Untitled Question"}
                    </span>
                    <span className="text-muted">
                      {q.type} - {q.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}