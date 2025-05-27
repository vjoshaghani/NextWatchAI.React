using System;
using server.Models;

namespace server.Services;

public interface IAiRecommendationService
{
    Task<AiRecommendationResult> RecommendMovieAsync(string mood);
}