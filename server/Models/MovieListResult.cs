namespace server.Models
{
    public class MovieListResult
    {
        public List<MovieVM> Movies { get; set; } = new();
        public int TotalPages { get; set; }
    }
}
