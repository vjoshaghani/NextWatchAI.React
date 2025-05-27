using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using server.Data.Entities;

namespace server.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(f => f.FavoriteId);

                entity.HasIndex(f => new { f.UserId, f.MovieId })
                    .IsUnique();

                entity.Property(f => f.Note)
                    .IsRequired(false);

                entity.HasOne(f => f.User)
                    .WithMany()
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(f => f.Movie)
                    .WithMany()
                    .HasForeignKey(f => f.MovieId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
