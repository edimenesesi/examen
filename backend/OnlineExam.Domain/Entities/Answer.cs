namespace OnlineExam.Domain.Entities;

public class Answer
{
    public int Id { get; set; }
    public int SubmissionId { get; set; }
    public int QuestionId { get; set; }
    public string Response { get; set; } = string.Empty;
    public bool? IsCorrect { get; set; }

    public Submission? Submission { get; set; }
    public Question? Question { get; set; }
}
