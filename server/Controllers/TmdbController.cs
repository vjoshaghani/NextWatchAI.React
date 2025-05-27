// Controllers/TmdbController.cs
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TmdbController : ControllerBase
    {
        private readonly IHttpClientFactory _http;
        private readonly string _apiKey;

        public TmdbController(IHttpClientFactory http, string apiKey)
        {
            _http = http;
            _apiKey = apiKey;
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular()
        {
            var client = _http.CreateClient("tmdb");
            // append ?api_key=… here
            var res = await client.GetAsync($"movie/popular?api_key={_apiKey}");
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode);
            var json = await res.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var client = _http.CreateClient("tmdb");
            var url = $"search/movie?api_key={_apiKey}&query={Uri.EscapeDataString(query)}";
            var res = await client.GetAsync(url);
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode);
            var json = await res.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages()
        {
            var client = _http.CreateClient("tmdb");
            var url = $"configuration/languages?api_key={_apiKey}";
            var res = await client.GetAsync(url);
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode);
            var json = await res.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }
    }
}
