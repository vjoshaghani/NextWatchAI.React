namespace server.Models
{
    public class MovieVM
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Overview { get; set; }
        public string? PosterUrl { get; set; }
    }
}
