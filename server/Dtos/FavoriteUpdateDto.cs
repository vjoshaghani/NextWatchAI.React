// Dtos/FavoriteUpdateDto.cs
using System.ComponentModel.DataAnnotations;

namespace server.Dtos
{
    public class FavoriteUpdateDto
    {
        public string? Note { get; set; } = string.Empty;
    }
}
