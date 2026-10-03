namespace OnlineExam.Domain.Entities;

public class ExamAssignment
{
    public int Id { get; set; }
    public int ExamId { get; set; }
    public int StudentId { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public Exam? Exam { get; set; }
    public User? Student { get; set; }
}
