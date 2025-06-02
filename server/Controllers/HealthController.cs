using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using server.Data;                   // assuming ApplicationDbContext is in server.Data
using Microsoft.EntityFrameworkCore; // for ExecuteSqlRawAsync

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<HealthController> _logger;

        public HealthController(
            ApplicationDbContext dbContext,
            ILogger<HealthController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet("keep-alive")]
        [HttpHead("keep-alive")]    
        public async Task<IActionResult> KeepAlive()
        {
            try
            {
                // lightweight query to ensure DB connection is active
                await _dbContext.Database.ExecuteSqlRawAsync("SELECT 1");
                return Ok("Alive");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in keep-alive endpoint.");
                // We don’t want to fail the entire app if the DB is still asleep,
                // so return 500 but allow the external ping service to retry.
                return StatusCode(500, "Error");
            }
        }
    }
}
