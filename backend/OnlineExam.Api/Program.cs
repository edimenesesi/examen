using Microsoft.EntityFrameworkCore;
using OnlineExam.Infrastructure.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDbContext<OnlineExamDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


app.UseHttpsRedirection();
app.UseCors("Frontend");

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    application = "Online Exam API",
    status = "Running"
}));

app.Run();

public partial class Program { }