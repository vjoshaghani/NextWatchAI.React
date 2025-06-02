using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using server.Data; // ← where ApplicationDbContext lives

namespace server.Services
{
    public class DatabaseWarmupService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _provider;
        private readonly ILogger<DatabaseWarmupService> _logger;
        private CancellationTokenSource _cts = new();

        // ◀︎ Notice we take only IServiceProvider here, not ApplicationDbContext
        public DatabaseWarmupService(
            IServiceProvider provider,
            ILogger<DatabaseWarmupService> logger)
        {
            _provider = provider;
            _logger   = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("[Warmup] Starting database warm-up...");

            using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, _cts.Token);

            // ◀︎ Create a scope so we can get a scoped ApplicationDbContext
            using var scope = _provider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var attempt = 0;
            var maxAttempts = 5;
            var delay = TimeSpan.FromSeconds(2);

            while (!linkedCts.IsCancellationRequested && attempt < maxAttempts)
            {
                attempt++;
                try
                {
                    _logger.LogInformation("[Warmup] Attempt {Attempt} to connect to database...", attempt);
                    if (await dbContext.Database.CanConnectAsync(linkedCts.Token))
                    {
                        _logger.LogInformation("[Warmup] Database is now available (attempt {Attempt}).", attempt);
                        return;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "[Warmup] Attempt {Attempt} failed. Retrying in {Delay}s...", attempt, delay.TotalSeconds);
                }

                try
                {
                    await Task.Delay(delay, linkedCts.Token);
                }
                catch (TaskCanceledException)
                {
                    return;
                }
            }

            try
            {
                if (!await dbContext.Database.CanConnectAsync(linkedCts.Token))
                {
                    _logger.LogWarning("[Warmup] Could not connect after {MaxAttempts} attempts. Proceeding anyway.", maxAttempts);
                }
            }
            catch
            {
                _logger.LogWarning("[Warmup] Final CanConnectAsync threw. Proceeding anyway.");
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("[Warmup] Stopping database warm-up service.");
            _cts.Cancel();
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _cts.Cancel();
            _cts.Dispose();
        }
    }
}
