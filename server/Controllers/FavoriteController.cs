// Controllers/FavoritesController.cs
using System.Net.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Data.Entities;
using server.Dtos;

namespace server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
    private readonly ApplicationDbContext   _db;
    private readonly IHttpClientFactory     _httpFactory;
    private readonly string                 _tmdbApiKey;

    public FavoritesController(
        ApplicationDbContext db,
        IHttpClientFactory httpFactory,
        IConfiguration config)
    {
        _db         = db;
        _httpFactory= httpFactory;
        _tmdbApiKey = config.GetSection("Tmdb")["ApiKey"]!;
    }

        // helper to pull the user ID from the JWT ("uid" claim)
        private string GetUserId()
            => User.FindFirst("uid")?.Value
               ?? throw new InvalidOperationException("User ID claim missing");

        /// GET /api/favorites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FavoriteDto>>> GetMyFavorites()
        {
            var uid = GetUserId();

            var list = await _db.Favorites
                .Where(f => f.UserId == uid)
                .Include(f => f.Movie)
                .Select(f => new FavoriteDto
                {
                    TmdbId    = f.Movie.TmdbId,
                    Title     = f.Movie.Title,
                    PosterUrl = f.Movie.PosterUrl,
                    Overview  = f.Movie.Overview,
                    Note      = f.Note
                })
                .ToListAsync();

            return Ok(list);
        }
    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] FavoriteCreateDto dto)
    {
        var uid = GetUserId();

        // 1) Find or create the Movie entity
        var movie = await _db.Movies.SingleOrDefaultAsync(m => m.TmdbId == dto.TmdbId);
        if (movie == null)
        {
            var client = _httpFactory.CreateClient("tmdb");
            var res    = await client.GetAsync($"movie/{dto.TmdbId}?api_key={_tmdbApiKey}");
            if (!res.IsSuccessStatusCode)
                return BadRequest(new { message = "Unable to fetch movie details." });

            // you may want a strongly-typed DTO here; for brevity we'll use JsonDocument
            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            var root = doc.RootElement;

            movie = new Movie
            {
                TmdbId     = dto.TmdbId,
                Title      = root.GetProperty("title").GetString()!,
                PosterUrl  = root.GetProperty("poster_path").GetString(),
                Overview   = root.GetProperty("overview").GetString()
            };
            _db.Movies.Add(movie);
            await _db.SaveChangesAsync();
        }

        // 2) Prevent duplicate favorites
        if (await _db.Favorites.AnyAsync(
                f => f.UserId == uid && f.Movie.TmdbId == dto.TmdbId))
        {
            return Conflict(new { message = "Already favorited." });
        }

        // 3) Create the Favorite
        var fav = new Favorite
        {
            UserId  = uid,
            MovieId = movie.MovieId,
            Note    = dto.Note
        };
        _db.Favorites.Add(fav);
        await _db.SaveChangesAsync();

        return StatusCode(201);
    }
    
        /// PUT /api/favorites/{tmdbId}
        [HttpPut("{tmdbId:int}")]
        public async Task<IActionResult> UpdateNote(int tmdbId, [FromBody] FavoriteUpdateDto dto)
        {
            var uid = GetUserId();

            var fav = await _db.Favorites
                .Include(f => f.Movie)
                .SingleOrDefaultAsync(f => f.UserId == uid && f.Movie.TmdbId == tmdbId);

            if (fav == null)
                return NotFound();

            fav.Note = dto.Note;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        /// DELETE /api/favorites/{tmdbId}
        [HttpDelete("{tmdbId:int}")]
        public async Task<IActionResult> DeleteFavorite(int tmdbId)
        {
            var uid = GetUserId();

            var fav = await _db.Favorites
                .Include(f => f.Movie)
                .SingleOrDefaultAsync(f => f.UserId == uid && f.Movie.TmdbId == tmdbId);

            if (fav == null)
                return NotFound();

            _db.Favorites.Remove(fav);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
