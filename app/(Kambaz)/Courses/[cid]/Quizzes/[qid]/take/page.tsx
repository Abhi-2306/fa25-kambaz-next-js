/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";

export default function TakeQuiz() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [latestAttempt, setLatestAttempt] = useState<any>(null);
    const [attemptCount, setAttemptCount] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const quizData = await client.findQuizById(qid as string);
                setQuiz(quizData);

                // Get previous attempts
                const attempts = await client.getAttempts(qid as string);
                setAttemptCount(attempts.length);

                if (attempts.length > 0) {
                    const latest = await client.getLatestAttempt(qid as string);
                    setLatestAttempt(latest);

                    // Check if user can still take the quiz
                    if (!quizData.multipleAttempts && attempts.length > 0) {
                        setSubmitted(true);
                        setScore(latest.score);
                        // Restore answers from latest attempt
                        const restoredAnswers: Record<string, any> = {};
                        latest.answers.forEach((a: any) => {
                            restoredAnswers[a.questionId] = a.answer;
                        });
                        setAnswers(restoredAnswers);
                    } else if (quizData.multipleAttempts && attempts.length >= quizData.howManyAttempts) {
                        setSubmitted(true);
                        setScore(latest.score);
                        const restoredAnswers: Record<string, any> = {};
                        latest.answers.forEach((a: any) => {
                            restoredAnswers[a.questionId] = a.answer;
                        });
                        setAnswers(restoredAnswers);
                    }
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setError("Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [qid]);

    const handleAnswerChange = (questionId: string, answer: any) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let totalScore = 0;

        quiz.questions.forEach((question: any) => {
            const userAnswer = answers[question._id];

            if (question.type === "multiple-choice") {
                const correctChoice = question.choices.find((c: any) => c.isCorrect);
                if (correctChoice && userAnswer === correctChoice.text) {
                    totalScore += question.points;
                }
            } else if (question.type === "true-false") {
                if (userAnswer === question.correctAnswer) {
                    totalScore += question.points;
                }
            } else if (question.type === "fill-blank") {
                const isCorrect = question.possibleAnswers.some(
                    (ans: string) => ans.toLowerCase().trim() === userAnswer?.toLowerCase().trim()
                );
                if (isCorrect) {
                    totalScore += question.points;
                }
            }
        });

        return totalScore;
    };

    const handleSubmit = async () => {
        try {
            const finalScore = calculateScore();

            const attemptData = {
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    questionId,
                    answer,
                })),
                score: finalScore,
            };

            const newAttempt = await client.submitAttempt(qid as string, attemptData);
            setLatestAttempt(newAttempt);
            setScore(finalScore);
            setSubmitted(true);
            setAttemptCount(attemptCount + 1);
        } catch (error: any) {
            console.error("Error submitting attempt:", error);
            setError(error.response?.data?.message || "Failed to submit quiz");
        }
    };

    const isCorrect = (question: any) => {
        const userAnswer = answers[question._id];

        if (question.type === "multiple-choice") {
            const correctChoice = question.choices.find((c: any) => c.isCorrect);
            return correctChoice && userAnswer === correctChoice.text;
        } else if (question.type === "true-false") {
            return userAnswer === question.correctAnswer;
        } else if (question.type === "fill-blank") {
            return question.possibleAnswers.some(
                (ans: string) => ans.toLowerCase().trim() === userAnswer?.toLowerCase().trim()
            );
        }
        return false;
    };

    const canRetake = () => {
        if (!quiz) return false;
        if (!quiz.multipleAttempts) return false;
        return attemptCount < quiz.howManyAttempts;
    };

    const handleRetake = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    if (loading) {
        return <div className="container mt-4">Loading quiz...</div>;
    }

    if (error) {
        return <div className="container mt-4 alert alert-danger">{error}</div>;
    }

    if (!quiz) {
        return <div className="container mt-4">Quiz not found</div>;
    }

    // Check if quiz is available
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (availableDate && now < availableDate) {
        return (
            <div className="container mt-4 alert alert-warning">
                This quiz is not available until {availableDate.toLocaleDateString()}
            </div>
        );
    }

    if (untilDate && now > untilDate) {
        return (
            <div className="container mt-4 alert alert-danger">
                This quiz is no longer available (closed on {untilDate.toLocaleDateString()})
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>{quiz.title}</h2>
            {quiz.description && <p className="text-muted">{quiz.description}</p>}

            <div className="mb-3">
                <strong>Points:</strong> {quiz.points} |
                <strong> Questions:</strong> {quiz.questions?.length || 0} |
                <strong> Time Limit:</strong> {quiz.timeLimit} minutes |
                <strong> Attempts:</strong> {attemptCount} / {quiz.multipleAttempts ? quiz.howManyAttempts : 1}
            </div>

            <hr />

            {quiz.questions?.map((question: any, index: number) => (
                <div
                    key={question._id}
                    className={`card mb-3 ${submitted ? (isCorrect(question) ? "border-success" : "border-danger") : ""
                        }`}
                >
                    <div className="card-header d-flex justify-content-between">
                        <span>Question {index + 1}</span>
                        <span>{question.points} pts</span>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{question.title}</p>
                        <div dangerouslySetInnerHTML={{ __html: question.question }} />

                        {/* Multiple Choice */}
                        {question.type === "multiple-choice" && (
                            <div className="mt-3">
                                {question.choices.map((choice: any, i: number) => (
                                    <div key={i} className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name={`question-${question._id}`}
                                            id={`choice-${question._id}-${i}`}
                                            value={choice.text}
                                            checked={answers[question._id] === choice.text}
                                            onChange={() => handleAnswerChange(question._id, choice.text)}
                                            disabled={submitted}
                                        />
                                        <label className="form-check-label" htmlFor={`choice-${question._id}-${i}`}>
                                            {choice.text}
                                            {submitted && quiz.showCorrectAnswers && choice.isCorrect && (
                                                <span className="text-success ms-2">✓ Correct Answer</span>
                                            )}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* True/False */}
                        {question.type === "true-false" && (
                            <div className="mt-3">
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name={`question-${question._id}`}
                                        id={`true-${question._id}`}
                                        checked={answers[question._id] === true}
                                        onChange={() => handleAnswerChange(question._id, true)}
                                        disabled={submitted}
                                    />
                                    <label className="form-check-label" htmlFor={`true-${question._id}`}>
                                        True
                                        {submitted && quiz.showCorrectAnswers && question.correctAnswer === true && (
                                            <span className="text-success ms-2">✓ Correct Answer</span>
                                        )}
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name={`question-${question._id}`}
                                        id={`false-${question._id}`}
                                        checked={answers[question._id] === false}
                                        onChange={() => handleAnswerChange(question._id, false)}
                                        disabled={submitted}
                                    />
                                    <label className="form-check-label" htmlFor={`false-${question._id}`}>
                                        False
                                        {submitted && quiz.showCorrectAnswers && question.correctAnswer === false && (
                                            <span className="text-success ms-2">✓ Correct Answer</span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Fill in the Blank */}
                        {question.type === "fill-blank" && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type your answer"
                                    value={answers[question._id] || ""}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                    disabled={submitted}
                                />
                                {submitted && quiz.showCorrectAnswers && (
                                    <small className="text-muted">
                                        Accepted answers: {question.possibleAnswers.join(", ")}
                                    </small>
                                )}
                            </div>
                        )}

                        {/* Show result after submit */}
                        {submitted && (
                            <div className={`mt-2 ${isCorrect(question) ? "text-success" : "text-danger"}`}>
                                {isCorrect(question) ? "✓ Correct" : "✗ Incorrect"}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            <hr />

            {submitted ? (
                <div className="mb-4">
                    <div className="alert alert-info">
                        <h4>Your Score: {score} / {quiz.points}</h4>
                        <p>Attempts used: {attemptCount} / {quiz.multipleAttempts ? quiz.howManyAttempts : 1}</p>
                    </div>
                    {canRetake() && (
                        <button className="btn btn-primary me-2" onClick={handleRetake}>
                            Retake Quiz
                        </button>
                    )}
                    <button
                        className="btn btn-secondary"
                        onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
                    >
                        Back to Quizzes
                    </button>
                </div>
            ) : (
                <div className="mb-4">
                    <button className="btn btn-danger me-2" onClick={handleSubmit}>
                        Submit Quiz
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => router.push(`/Kambaz/Courses/${cid}/Quizzes`)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}