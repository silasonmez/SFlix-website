using Microsoft.EntityFrameworkCore;
using SFlix.Models;

namespace SFlix.Services
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Movies> Movies { get; set; }
        public DbSet<Series> Series { get; set; }
        public DbSet<Favorites> Favorites { get; set; }
        public DbSet<Categories> Categories { get; set; }
        public DbSet<MoviesCategories> MoviesCategories { get; set; }
        public DbSet<SeriesCategories> SeriesCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<MoviesCategories>()
                .HasKey(mc => new { mc.MovieId, mc.CategoryId });

            modelBuilder.Entity<MoviesCategories>()
                .HasOne(mc => mc.Movie)
                .WithMany(m => m.MoviesCategories)
                .HasForeignKey(mc => mc.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MoviesCategories>()
                .HasOne(mc => mc.Category)
                .WithMany(c => c.MoviesCategories)
                .HasForeignKey(mc => mc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Series-Categories Many-to-Many
            modelBuilder.Entity<SeriesCategories>()
                .HasKey(sc => new { sc.SeriesId, sc.CategoryId });

            modelBuilder.Entity<SeriesCategories>()
                .HasOne(sc => sc.Series)
                .WithMany(s => s.SeriesCategories)
                .HasForeignKey(sc => sc.SeriesId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SeriesCategories>()
                .HasOne(sc => sc.Category)
                .WithMany(c => c.SeriesCategories)
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Veri Tipi kontrol ediyorum
            modelBuilder.Entity<Movies>()
                .Property(m => m.Title)
                .IsRequired()
                .HasMaxLength(255);

            modelBuilder.Entity<Categories>()
                .Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            // Index Eklenmesi
            modelBuilder.Entity<Categories>()
                .HasIndex(c => c.Name)
                .IsUnique();

            modelBuilder.Entity<Movies>()
                .HasIndex(m => m.Title);

            base.OnModelCreating(modelBuilder);
        }
    }
}
