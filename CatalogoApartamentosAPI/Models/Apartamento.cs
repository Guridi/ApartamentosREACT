using System.ComponentModel.DataAnnotations;

namespace CatalogoApartamentosAPI.Models;

// Describe los datos que recibe y devuelve la API para un apartamento.
public class Apartamento
{
    public int Id { get; set; }

    // Los atributos validan los valores recibidos por la API.
    [Required]
    [StringLength(20)]
    public string Numero { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Habitaciones { get; set; }

    [Range(1, int.MaxValue)]
    public int Banos { get; set; }

    public decimal Precio { get; set; }

    public bool Disponible { get; set; }

    [Range(1, int.MaxValue)]
    public int ResidencialId { get; set; }
}
