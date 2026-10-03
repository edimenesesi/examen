import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAvailableExams,
  getStudentResults
} from "../services/studentService";

function StudentPage() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const studentId = 2;

  useEffect(() => {
    async function loadData() {
      try {
        const [examData, resultData] = await Promise.all([
          getAvailableExams(),
          getStudentResults(studentId)
        ]);

        setExams(examData);
        setResults(resultData);
      } catch {
        setMessage("No se pudo conectar con el backend.");
      }
    }

    loadData();
  }, []);

  return (
    <div className="page">
      <Link to="/">← Volver al inicio</Link>

      <h1>Panel del Estudiante</h1>
      <p>Selecciona un examen para comenzar.</p>

      {message && <p className="message">{message}</p>}

      <div className="teacher-grid">
        <section className="panel">
          <h2>Exámenes disponibles</h2>

          {exams.length === 0 ? (
            <p>No hay exámenes disponibles.</p>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => (
                <div className="exam-item" key={exam.id}>
                  <h3>{exam.title}</h3>
                  <p>{exam.description}</p>
                  <p>
                    <strong>Duración:</strong>{" "}
                    {exam.durationMinutes} minutos
                  </p>

                  <Link
                    className="manage-button"
                    to={`/student/exams/${exam.id}`}
                  >
                    Iniciar examen
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Mis resultados</h2>

          {results.length === 0 ? (
            <p>Todavía no tienes resultados.</p>
          ) : (
            <div className="exam-list">
              {results.map((result) => (
                <div className="exam-item" key={result.submissionId}>
                  <h3>{result.examTitle}</h3>
                  <p>
                    Puntaje obtenido:{" "}
                    <strong>{result.score}</strong>
                  </p>
                  <p>
                    Fecha:{" "}
                    {new Date(result.submittedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentPage;