using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Domain.Entities;
using OnlineExam.Infrastructure.Data;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("questions")]
public class QuestionsController : ControllerBase
{
    private readonly OnlineExamDbContext _context;

    public QuestionsController(OnlineExamDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Question>> Create(Question question)
    {
        if (string.IsNullOrWhiteSpace(question.Text))
            return BadRequest("El texto de la pregunta es obligatorio.");

        if (question.Points <= 0)
            return BadRequest("El puntaje debe ser mayor a cero.");

        var examExists = await _context.Exams.AnyAsync(e => e.Id == question.ExamId);

        if (!examExists)
            return BadRequest("El examen especificado no existe.");

        question.Id = 0;

        foreach (var option in question.Options)
        {
            option.Id = 0;
            option.QuestionId = 0;
        }

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetByExam),
            new { examId = question.ExamId },
            question);
    }

    [HttpGet("{examId:int}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetByExam(int examId)
    {
        var examExists = await _context.Exams.AnyAsync(e => e.Id == examId);

        if (!examExists)
            return NotFound("El examen no existe.");

        var questions = await _context.Questions
            .AsNoTracking()
            .Include(q => q.Options)
            .Where(q => q.ExamId == examId)
            .OrderBy(q => q.Id)
            .ToListAsync();

        return Ok(questions);
    }
}
