// Dtos/FavoriteCreateDto.cs
using System.ComponentModel.DataAnnotations;

namespace server.Dtos
{
    public class FavoriteCreateDto
    {
        [Required]
        public int TmdbId { get; set; }

        public string? Note { get; set; }
    }
}
