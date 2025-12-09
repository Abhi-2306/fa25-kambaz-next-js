/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import * as client from "../../client";

export default function QuizPreview() {
    const { cid, qid } = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

    const handleMultipleChoiceChange = (questionId: string, choiceText: string, isChecked: boolean) => {
        const currentAnswers = answers[questionId] || [];
        let newAnswers: string[];
        
        if (isChecked) {
            newAnswers = [...currentAnswers, choiceText];
        } else {
            newAnswers = currentAnswers.filter((a: string) => a !== choiceText);
        }
        
        setAnswers({ ...answers, [questionId]: newAnswers });
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let totalScore = 0;

        quiz.questions.forEach((question: any) => {
            const userAnswer = answers[question._id];

            if (question.type === "multiple-choice") {
                const correctChoices = question.choices.filter((c: any) => c.isCorrect);
                const correctCount = correctChoices.length;
                
                if (correctCount === 0) return;
                
                const pointsPerCorrect = question.points / correctCount;
                const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                
                let questionScore = 0;
                userAnswers.forEach((ans: string) => {
                    const choice = question.choices.find((c: any) => c.text === ans);
                    if (choice?.isCorrect) {
                        questionScore += pointsPerCorrect;
                    }
                });
                
                totalScore += Math.max(0, questionScore);
                
            } else if (question.type === "true-false") {
                if (userAnswer === question.correctAnswer) {
                    totalScore += question.points;
                }
            } else if (question.type === "fill-blank") {
                const blanks = question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }];
                const userAnswers = answers[question._id] || [];

                let allCorrect = true;
                blanks.forEach((blank: any, index: number) => {
                    const ua = userAnswers[index] || "";
                    const isCorrect = blank.possibleAnswers.some(
                        (ans: string) => ans.toLowerCase().trim() === ua.toLowerCase().trim()
                    );
                    if (!isCorrect) allCorrect = false;
                });

                if (allCorrect) {
                    totalScore += question.points;
                }
            }
        });

        return Math.round(totalScore * 100) / 100;
    };

    const handleSubmit = () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setSubmitted(true);
    };

    const getQuestionScore = (question: any) => {
        const userAnswer = answers[question._id];

        if (question.type === "multiple-choice") {
            const correctChoices = question.choices.filter((c: any) => c.isCorrect);
            const correctCount = correctChoices.length;
            
            if (correctCount === 0) return 0;
            
            const pointsPerCorrect = question.points / correctCount;
            const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
            
            let questionScore = 0;
            userAnswers.forEach((ans: string) => {
                const choice = question.choices.find((c: any) => c.text === ans);
                if (choice?.isCorrect) {
                    questionScore += pointsPerCorrect;
                }
            });
            
            return Math.max(0, Math.round(questionScore * 100) / 100);
        } else if (question.type === "true-false") {
            return userAnswer === question.correctAnswer ? question.points : 0;
        } else if (question.type === "fill-blank") {
            const blanks = question.blanks || [{ possibleAnswers: question.possibleAnswers || [] }];
            const userAnswers = answers[question._id] || [];

            let allCorrect = true;
            blanks.forEach((blank: any, index: number) => {
                const ua = userAnswers[index] || "";
                const isCorrect = blank.possibleAnswers.some(
                    (ans: string) => ans.toLowerCase().trim() === ua.toLowerCase().trim()
                );
                if (!isCorrect) allCorrect = false;
            });

            return allCorrect ? question.points : 0;
        }
        return 0;
    };

    const isCorrect = (question: any) => {
        return getQuestionScore(question) === question.points;
    };

    const isPartiallyCorrect = (question: any) => {
        const score = getQuestionScore(question);
        return score > 0 && score < question.points;
    };

    const resetPreview = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    const totalPoints = quiz?.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

    if (loading) {
        return <div className="container mt-4">Loading quiz...</div>;
    }

    if (!quiz) {
        return <div className="container mt-4">Quiz not found</div>;
    }

    if (!quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    This quiz has no questions yet.
                </div>
                <Link href={`/Courses/${cid}/Quizzes/${qid}/edit/questions`} className="btn btn-primary">
                    Add Questions
                </Link>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const correctChoices = currentQuestion?.type === "multiple-choice" 
        ? currentQuestion.choices.filter((c: any) => c.isCorrect) 
        : [];
    const hasMultipleCorrect = correctChoices.length > 1;

    return (
        <div className="container mt-4">
            <div className="alert alert-warning">
                <strong>⚠️ This is a preview of the published version of the quiz</strong>
            </div>

            <h2>{quiz.title}</h2>
            {quiz.description && <p className="text-muted">{quiz.description}</p>}

            <div className="mb-3">
                <strong>Points:</strong> {totalPoints} |
                <strong> Questions:</strong> {quiz.questions.length} |
                <strong> Time Limit:</strong> {quiz.timeLimit} minutes
            </div>

            <hr />

            <div className="row">
                <div className="col-md-9">
                    {!submitted && currentQuestion && (
                        <div className="card mb-3">
                            <div className="card-header d-flex justify-content-between">
                                <span>Question {currentQuestionIndex + 1}</span>
                                <span>{currentQuestion.points} pts</span>
                            </div>
                            <div className="card-body">
                                <p className="card-text fw-bold">{currentQuestion.title}</p>
                                <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

                                {currentQuestion.type === "multiple-choice" && (
                                    <div className="mt-3">
                                        {hasMultipleCorrect && (
                                            <small className="text-muted d-block mb-2">
                                                Select all that apply
                                            </small>
                                        )}
                                        {currentQuestion.choices.map((choice: any, i: number) => {
                                            const userAnswers = Array.isArray(answers[currentQuestion._id]) ? answers[currentQuestion._id] : [];
                                            const isSelected = userAnswers.includes(choice.text);
                                            
                                            return (
                                                <div key={i} className="form-check">
                                                    <input
                                                        type={hasMultipleCorrect ? "checkbox" : "radio"}
                                                        className="form-check-input"
                                                        name={`question-${currentQuestion._id}`}
                                                        id={`choice-${currentQuestion._id}-${i}`}
                                                        checked={isSelected}
                                                        onChange={(e) => {
                                                            if (hasMultipleCorrect) {
                                                                handleMultipleChoiceChange(currentQuestion._id, choice.text, e.target.checked);
                                                            } else {
                                                                handleAnswerChange(currentQuestion._id, [choice.text]);
                                                            }
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor={`choice-${currentQuestion._id}-${i}`}>
                                                        {choice.text}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {currentQuestion.type === "true-false" && (
                                    <div className="mt-3">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name={`question-${currentQuestion._id}`}
                                                id={`true-${currentQuestion._id}`}
                                                checked={answers[currentQuestion._id] === true}
                                                onChange={() => handleAnswerChange(currentQuestion._id, true)}
                                            />
                                            <label className="form-check-label" htmlFor={`true-${currentQuestion._id}`}>
                                                True
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name={`question-${currentQuestion._id}`}
                                                id={`false-${currentQuestion._id}`}
                                                checked={answers[currentQuestion._id] === false}
                                                onChange={() => handleAnswerChange(currentQuestion._id, false)}
                                            />
                                            <label className="form-check-label" htmlFor={`false-${currentQuestion._id}`}>
                                                False
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.type === "fill-blank" && (
                                    <div className="mt-3">
                                        {(currentQuestion.blanks || [{ possibleAnswers: currentQuestion.possibleAnswers || [] }]).map((blank: any, blankIndex: number) => (
                                            <div key={blankIndex} className="mb-3">
                                                <label className="form-label">Blank {blankIndex + 1}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={`Answer for blank ${blankIndex + 1}`}
                                                    value={answers[currentQuestion._id]?.[blankIndex] || ""}
                                                    onChange={(e) => {
                                                        const currentAnswers = answers[currentQuestion._id] || [];
                                                        const newAnswers = [...currentAnswers];
                                                        newAnswers[blankIndex] = e.target.value;
                                                        handleAnswerChange(currentQuestion._id, newAnswers);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="card-footer d-flex justify-content-between">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                    disabled={isFirstQuestion}
                                >
                                    Previous
                                </button>
                                {isLastQuestion ? (
                                    <button className="btn btn-danger" onClick={handleSubmit}>
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {submitted && (
                        <div>
                            <div className="alert alert-info">
                                <h4>Score: {score} / {totalPoints}</h4>
                            </div>

                            {quiz.questions.map((question: any, index: number) => {
                                const questionScore = getQuestionScore(question);
                                const fullyCorrect = isCorrect(question);
                                const partiallyCorrect = isPartiallyCorrect(question);
                                
                                let borderClass = "";
                                if (fullyCorrect) borderClass = "border-success";
                                else if (partiallyCorrect) borderClass = "border-warning";
                                else borderClass = "border-danger";

                                return (
                                    <div key={question._id} className={`card mb-3 ${borderClass}`}>
                                        <div className="card-header d-flex justify-content-between">
                                            <span>Question {index + 1}</span>
                                            <span>{questionScore}/{question.points} pts</span>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">{question.title}</p>
                                            <div className={`mt-2 ${fullyCorrect ? "text-success" : partiallyCorrect ? "text-warning" : "text-danger"}`}>
                                                {fullyCorrect && "✓ Correct"}
                                                {partiallyCorrect && `◐ Partially Correct`}
                                                {!fullyCorrect && !partiallyCorrect && "✗ Incorrect"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <button className="btn btn-secondary me-2" onClick={resetPreview}>
                                Try Again
                            </button>
                            <Link href={`/Courses/${cid}/Quizzes/${qid}/edit`} className="btn btn-primary">
                                Edit Quiz
                            </Link>
                        </div>
                    )}
                </div>

                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header">
                            <strong>Questions</strong>
                        </div>
                        <ul className="list-group list-group-flush">
                            {quiz.questions.map((q: any, index: number) => {
                                const fullyCorrect = submitted && isCorrect(q);
                                const partiallyCorrect = submitted && isPartiallyCorrect(q);
                                
                                let itemClass = "";
                                if (submitted) {
                                    if (fullyCorrect) itemClass = "list-group-item-success";
                                    else if (partiallyCorrect) itemClass = "list-group-item-warning";
                                    else itemClass = "list-group-item-danger";
                                }

                                return (
                                    <li
                                        key={q._id}
                                        className={`list-group-item d-flex justify-content-between align-items-center 
                                            ${currentQuestionIndex === index && !submitted ? "active" : ""} 
                                            ${itemClass}`}
                                        style={{ cursor: submitted ? "default" : "pointer" }}
                                        onClick={() => !submitted && setCurrentQuestionIndex(index)}
                                    >
                                        <span>Question {index + 1}</span>
                                        {answers[q._id] !== undefined && !submitted && (
                                            <span className="badge bg-secondary">Answered</span>
                                        )}
                                        {submitted && (
                                            <span>
                                                {fullyCorrect && "✓"}
                                                {partiallyCorrect && "◐"}
                                                {!fullyCorrect && !partiallyCorrect && "✗"}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            <hr />

            <Link href={`/Courses/${cid}/Quizzes/${qid}/edit`} className="btn btn-secondary">
                Keep Editing This Quiz
            </Link>
        </div>
    );
}