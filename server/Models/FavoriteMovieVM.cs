namespace server.Models
{
    public class FavoriteMovieVM : MovieVM
    {
        public int FavoriteId { get; set; }
        public string? Note { get; set; }
    }
}
