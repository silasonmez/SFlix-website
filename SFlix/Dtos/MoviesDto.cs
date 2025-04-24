using System.ComponentModel.DataAnnotations;

public class MoviesDto
{
    [Required]
    public string Title { get; set; }
    [Required]
    public int ReleaseYear { get; set; }
    [Required]
    public string Duration { get; set; }
    [Required]
    public double? ImdbRating { get; set; }
    [Required]
    public string Description { get; set; }
    public List<int> CategoryIds { get; set; } 
}
