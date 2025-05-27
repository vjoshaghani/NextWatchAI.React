using System.ComponentModel.DataAnnotations;

namespace server.Data.Entities
{
    public class Movie
    {
        public int MovieId { get; set; }

        public int TmdbId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? PosterUrl { get; set; }
        public string? Overview { get; set; }
    }
}
