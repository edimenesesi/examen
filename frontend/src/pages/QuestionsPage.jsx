import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createQuestion, getQuestions } from "../services/questionService";

function QuestionsPage() {
  const { examId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState("");
  const [type, setType] = useState("0");
  const [points, setPoints] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [message, setMessage] = useState("");

  async function loadQuestions() {
    try {
      const data = await getQuestions(examId);
      setQuestions(data);
    } catch {
      setMessage("No se pudieron cargar las preguntas.");
    }
  }

  useEffect(() => {
    loadQuestions();
  }, [examId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!text.trim()) {
      setMessage("El texto de la pregunta es obligatorio.");
      return;
    }

    let options = [];
    let answer = correctAnswer;

    if (type === "0") {
      if (!option1 || !option2 || !option3 || !correctAnswer) {
        setMessage("Completa las opciones y selecciona la respuesta correcta.");
        return;
      }

      options = [option1, option2, option3].map((option) => ({
        text: option,
        isCorrect: option === correctAnswer,
      }));
    }

    if (type === "1") {
      if (!correctAnswer) {
        setMessage("Selecciona True o False.");
        return;
      }

      options = [
        { text: "True", isCorrect: correctAnswer === "True" },
        { text: "False", isCorrect: correctAnswer === "False" },
      ];
    }

    if (type === "2") {
      answer = null;
      options = [];
    }

    try {
      await createQuestion({
        examId: Number(examId),
        text,
        type: Number(type),
        correctAnswer: answer,
        points: Number(points),
        options,
      });

      setText("");
      setCorrectAnswer("");
      setOption1("");
      setOption2("");
      setOption3("");
      setPoints(1);
      setMessage("Pregunta creada correctamente.");

      await loadQuestions();
    } catch {
      setMessage("No se pudo crear la pregunta.");
    }
  }

  return (
    <div className="page">
      <Link to="/teacher">← Volver al panel docente</Link>

      <h1>Gestión de Preguntas</h1>
      <p>Examen ID: {examId}</p>

      <div className="teacher-grid">
        <section className="panel">
          <h2>Nueva pregunta</h2>

          <form onSubmit={handleSubmit}>
            <label>Pregunta</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe la pregunta"
            />

            <label>Tipo</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCorrectAnswer("");
              }}
            >
              <option value="0">Opción múltiple</option>
              <option value="1">Verdadero / Falso</option>
              <option value="2">Pregunta abierta</option>
            </select>

            {type === "0" && (
              <>
                <label>Opción 1</label>
                <input
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                />

                <label>Opción 2</label>
                <input
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                />

                <label>Opción 3</label>
                <input
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                />

                <label>Respuesta correcta</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {option1 && <option value={option1}>{option1}</option>}
                  {option2 && <option value={option2}>{option2}</option>}
                  {option3 && <option value={option3}>{option3}</option>}
                </select>
              </>
            )}

            {type === "1" && (
              <>
                <label>Respuesta correcta</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="True">Verdadero</option>
                  <option value="False">Falso</option>
                </select>
              </>
            )}

            <label>Puntos</label>
            <input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />

            <button type="submit">Agregar pregunta</button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2>Preguntas registradas</h2>

          {questions.length === 0 ? (
            <p>Este examen todavía no tiene preguntas.</p>
          ) : (
            <div className="exam-list">
              {questions.map((question) => (
                <div className="exam-item" key={question.id}>
                  <h3>{question.text}</h3>
                  <p>
                    Tipo:{" "}
                    {question.type === 0
                      ? "Opción múltiple"
                      : question.type === 1
                      ? "Verdadero/Falso"
                      : "Abierta"}
                  </p>
                  <strong>{question.points} punto(s)</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default QuestionsPage;