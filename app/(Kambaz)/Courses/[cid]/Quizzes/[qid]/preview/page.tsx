/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import * as client from "../../client";

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await client.findQuizById(qid as string);
                setQuiz(data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
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

    const handleSubmit = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setSubmitted(true);
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

    const resetPreview = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    if (loading) {
        return <div>Loading quiz...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <div className="container mt-4">
            <div className="alert alert-warning">
                <strong>⚠️ This is a preview of the published version of the quiz</strong>
            </div>

            <h2>{quiz.title}</h2>
            {quiz.description && <p className="text-muted">{quiz.description}</p>}

            <div className="mb-3">
                <strong>Points:</strong> {quiz.points} |
                <strong> Questions:</strong> {quiz.questions?.length || 0} |
                <strong> Time Limit:</strong> {quiz.timeLimit} minutes
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
                                            {submitted && choice.isCorrect && (
                                                <span className="text-success ms-2">✓ Correct</span>
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
                                        {submitted && question.correctAnswer === true && (
                                            <span className="text-success ms-2">✓ Correct</span>
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
                                        {submitted && question.correctAnswer === false && (
                                            <span className="text-success ms-2">✓ Correct</span>
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
                                {submitted && (
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
                        <h4>Score: {score} / {quiz.points}</h4>
                    </div>
                    <button className="btn btn-secondary me-2" onClick={resetPreview}>
                        Try Again
                    </button>
                    <Link href={`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit`} className="btn btn-primary">
                        Edit Quiz
                    </Link>
                </div>
            ) : (
                <div className="mb-4">
                    <button className="btn btn-danger me-2" onClick={handleSubmit}>
                        Submit Quiz
                    </button>
                    <Link href={`/Courses/${cid}/Quizzes/${qid}/edit`} className="btn btn-secondary">
                        Keep Editing This Quiz
                    </Link>
                </div>
            )}
        </div>
    );
}