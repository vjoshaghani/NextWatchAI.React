using server.Models;
using server.Services;
using OpenAI;
using OpenAI.Chat;
using OpenAI.Models;

public class GptRecommendationService : IAiRecommendationService
{
    private readonly ChatClient _chatClient;

    public GptRecommendationService(IConfiguration config)
    {
        var apiKey = config["OpenAI:ApiKey"]
                     ?? throw new ArgumentNullException("OpenAI:ApiKey");
        var model  = config["OpenAI:Model"] ?? "gpt-4.1-nano";

        _chatClient = new ChatClient(model: model, apiKey: apiKey);      
    }

    public async Task<AiRecommendationResult> RecommendMovieAsync(string mood)
    {
        var systemPrompt = "You're an AI assistant helping users find movies " +
                           "that match their mood. Based on the user's mood, " +
                           "recommend one movie. Respond as: " +
                           "<title>|<explanation that clearly connects the movie " +
                           "to the user's mood. Do not summarize the plot. " +
                           "Make it feel like a personal recommendation.>";
        var userPrompt   = $"Mood: {mood}";

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userPrompt)
        };

        try
        {
            var options = new ChatCompletionOptions
            {
                Temperature = 0.8f,
                MaxOutputTokenCount   = 70
            };

            // Call into the new SDK
            ChatCompletion completion = await _chatClient.CompleteChatAsync(messages, options);

            var raw = completion.Content.FirstOrDefault()?.Text?.Trim() ?? "";
            var parts = raw.Split('|', 2);
            if (parts.Length != 2)
                throw new FormatException("Unexpected response format");

            return new AiRecommendationResult
            {
                Mood       = mood,
                MovieTitle = parts[0].Trim().Trim('"'),
                Reasoning  = parts[1].Trim().Trim('"')
            };
        }
        catch (Exception ex)
        {
            return new AiRecommendationResult
            {
                Mood = mood,
                MovieTitle = "",
                Reasoning = $"Error: {ex.Message}"
            };
        }
    }
}
