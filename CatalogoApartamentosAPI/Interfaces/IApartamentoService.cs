using CatalogoApartamentosAPI.Models;

namespace CatalogoApartamentosAPI.Interfaces;

// Define las operaciones que deben ofrecer ambos servicios de apartamentos.
public interface IApartamentoService
{
    IEnumerable<Apartamento> GetApartamentos();
    Apartamento? GetApartamentoById(int id);
    int CrearApartamento(Apartamento apartamento);
    bool ActualizarApartamento(int id, Apartamento apartamento);
    bool EliminarApartamento(int id);
}
