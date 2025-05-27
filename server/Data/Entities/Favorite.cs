using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace server.Data.Entities
{
    public class Favorite
    {
        public int FavoriteId { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public int MovieId { get; set; }

        public string? Note { get; set; }

        public IdentityUser User { get; set; } = null!;
        public Movie Movie { get; set; } = null!;
    }
}
