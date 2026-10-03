using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Domain.Entities;
using OnlineExam.Domain.Enums;
using OnlineExam.Infrastructure.Data;

namespace OnlineExam.Api.Controllers;

[ApiController]
public class SubmissionsController : ControllerBase
{
    private readonly OnlineExamDbContext _context;

    public SubmissionsController(OnlineExamDbContext context)
    {
        _context = context;
    }

    [HttpPost("submissions")]
    public async Task<ActionResult> Submit(SubmissionRequest request)
    {
        var exam = await _context.Exams
            .Include(e => e.Questions)
            .FirstOrDefaultAsync(e => e.Id == request.ExamId);

        if (exam is null)
            return BadRequest("El examen no existe.");

        var userExists = await _context.Users
            .AnyAsync(u => u.Id == request.UserId);

        if (!userExists)
            return BadRequest("El usuario no existe.");

        if (request.Answers is null || request.Answers.Count == 0)
            return BadRequest("Debe enviar al menos una respuesta.");

        var submission = new Submission
        {
            ExamId = request.ExamId,
            UserId = request.UserId,
            SubmittedAt = DateTime.UtcNow
        };

        decimal score = 0;

        foreach (var answerRequest in request.Answers)
        {
            var question = exam.Questions
                .FirstOrDefault(q => q.Id == answerRequest.QuestionId);

            if (question is null)
                return BadRequest(
                    $"La pregunta {answerRequest.QuestionId} no pertenece al examen.");

            bool? isCorrect = null;

            if (question.Type != QuestionType.Open)
            {
                isCorrect = string.Equals(
                    question.CorrectAnswer?.Trim(),
                    answerRequest.Response?.Trim(),
                    StringComparison.OrdinalIgnoreCase);

                if (isCorrect == true)
                    score += question.Points;
            }

            submission.Answers.Add(new Answer
            {
                QuestionId = question.Id,
                Response = answerRequest.Response ?? string.Empty,
                IsCorrect = isCorrect
            });
        }

        submission.Score = score;

        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            submissionId = submission.Id,
            examId = submission.ExamId,
            userId = submission.UserId,
            score = submission.Score,
            submittedAt = submission.SubmittedAt
        });
    }

    [HttpGet("results/{userId:int}")]
    public async Task<ActionResult> GetResults(int userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

        if (!userExists)
            return NotFound("El usuario no existe.");

        var results = await _context.Submissions
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .Include(s => s.Exam)
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => new
            {
                submissionId = s.Id,
                examId = s.ExamId,
                examTitle = s.Exam != null ? s.Exam.Title : "",
                score = s.Score,
                submittedAt = s.SubmittedAt
            })
            .ToListAsync();

        return Ok(results);
    }
}

public class SubmissionRequest
{
    public int ExamId { get; set; }
    public int UserId { get; set; }
    public List<AnswerRequest> Answers { get; set; } = new();
}

public class AnswerRequest
{
    public int QuestionId { get; set; }
    public string Response { get; set; } = string.Empty;
}
