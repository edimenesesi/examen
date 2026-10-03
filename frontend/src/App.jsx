import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TeacherPage from "./pages/TeacherPage";
import QuestionsPage from "./pages/QuestionsPage";
import StudentPage from "./pages/StudentPage";
import TakeExamPage from "./pages/TakeExamPage";

function Home() {
  return (
    <div className="home">
      <h1>Plataforma de Exámenes Online</h1>
      <p>Selecciona el panel al que deseas ingresar.</p>

      <div className="cards">
        <Link className="card" to="/teacher">
          <h2>Docente</h2>
          <p>Crear exámenes, preguntas y consultar resultados.</p>
        </Link>

        <Link className="card" to="/student">
          <h2>Estudiante</h2>
          <p>Visualizar y desarrollar exámenes asignados.</p>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/teacher" element={<TeacherPage />} />

        <Route
          path="/teacher/exams/:examId/questions"
          element={<QuestionsPage />}
        />

        <Route path="/student" element={<StudentPage />} />

        <Route
          path="/student/exams/:examId"
          element={<TakeExamPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;