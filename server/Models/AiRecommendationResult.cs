namespace server.Models;

public class AiRecommendationResult
{
    public string Mood { get; set; } = string.Empty;
    public string Reasoning { get; set; } = string.Empty;
    public string MovieTitle { get; set; } = string.Empty;
}
