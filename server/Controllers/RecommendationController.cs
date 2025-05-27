using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

[ApiController]
[Route("api/ai")]
public class RecommendationController : ControllerBase
{
    private readonly IAiRecommendationService _aiService;

    public RecommendationController(IAiRecommendationService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("recommend")]
    public async Task<ActionResult<AiRecommendationResult>> Recommend([FromBody] MoodRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Mood))
            return BadRequest("Mood is required.");

        var result = await _aiService.RecommendMovieAsync(req.Mood);

        return Ok(result);
    }
}

public class MoodRequest
{
    public string Mood { get; set; } = "";
}
