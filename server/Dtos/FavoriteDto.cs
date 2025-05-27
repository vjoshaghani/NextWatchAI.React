// Dtos/FavoriteDto.cs
namespace server.Dtos
{
    public class FavoriteDto
    {
        public int TmdbId    { get; set; }
        public string Title  { get; set; } = null!;
        public string? PosterUrl { get; set; }
        public string? Overview  { get; set; }
        public string? Note      { get; set; }
    }
}
