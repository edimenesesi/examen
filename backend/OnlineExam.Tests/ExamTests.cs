using OnlineExam.Domain.Entities;

namespace OnlineExam.Tests;

public class ExamTests
{
    [Fact]
    public void Exam_ShouldStoreBasicInformation()
    {
        var exam = new Exam
        {
            Title = "Examen de Programacion",
            Description = "Evaluacion de prueba",
            DurationMinutes = 30,
            TeacherId = 1
        };

        Assert.Equal("Examen de Programacion", exam.Title);
        Assert.Equal("Evaluacion de prueba", exam.Description);
        Assert.Equal(30, exam.DurationMinutes);
        Assert.Equal(1, exam.TeacherId);
    }

    [Fact]
    public void Exam_ShouldStartWithEmptyQuestionCollection()
    {
        var exam = new Exam();

        Assert.NotNull(exam.Questions);
        Assert.Empty(exam.Questions);
    }
}
