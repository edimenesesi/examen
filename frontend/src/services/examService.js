const API_URL = "http://localhost:5001";

export async function getExams() {
  const response = await fetch(`${API_URL}/exams`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los examenes.");
  }

  return response.json();
}

export async function createExam(exam) {
  const response = await fetch(`${API_URL}/exams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exam),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "No se pudo crear el examen.");
  }

  return response.json();
}