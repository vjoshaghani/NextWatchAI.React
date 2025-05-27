// Controllers/AuthController.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Dtos;              // <- make sure this matches your namespace

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration            _config;

        public AuthController(
            UserManager<IdentityUser> userManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _config      = config;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Prevent duplicate emails
            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return Conflict(new { message = "Email already in use." });

            var user = new IdentityUser
            {
                UserName = dto.Email,
                Email    = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                // aggregate errors back to client
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            return StatusCode(201);
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null ||
                !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            // 1) Build claims
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
                new Claim("uid",                         user.Id),
                // add roles here if you need them:
                // new Claim(ClaimTypes.Role, "Administrator")
            };

            // 2) Read JWT settings
            var jwtSection = _config.GetSection("Jwt");
            var keyBytes   = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

            // 3) Create the token
            var token = new JwtSecurityToken(
                issuer:             jwtSection["Issuer"],
                audience:           jwtSection["Audience"],
                claims:             claims,
                expires:            DateTime.UtcNow.AddMinutes(
                                       int.Parse(jwtSection["ExpireMinutes"]!)),
                signingCredentials: new SigningCredentials(
                                       new SymmetricSecurityKey(keyBytes),
                                       SecurityAlgorithms.HmacSha256
                                   )
            );

            // 4) Return it
            var encodedJwt = new JwtSecurityTokenHandler()
                                 .WriteToken(token);
            return Ok(new { token = encodedJwt });
        }
    }
}
