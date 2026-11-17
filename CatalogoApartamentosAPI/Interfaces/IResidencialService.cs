using CatalogoApartamentosAPI.Models;

namespace CatalogoApartamentosAPI.Interfaces;

// Define las operaciones que deben ofrecer ambos servicios de residenciales.
public interface IResidencialService
{
    IEnumerable<Residencial> GetResidenciales();
    Residencial? GetResidencialById(int id);
    int CrearResidencial(Residencial residencial);
    bool ActualizarResidencial(int id, Residencial residencial);
    bool EliminarResidencial(int id);
    bool TieneApartamentos(int id);
}
