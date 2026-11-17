using CatalogoApartamentosAPI.Interfaces;
using CatalogoApartamentosAPI.Models;

namespace CatalogoApartamentosAPI.Services;

// Alternativa local a SQL Server para presentar y probar la aplicación.
public class CatalogoDemostracion : IResidencialService, IApartamentoService
{
    // El bloqueo protege los datos compartidos por solicitudes simultáneas.
    private readonly object _sincronizacion = new();

    // Datos iniciales para probar el catálogo sin preparar la base de datos.
    private readonly Dictionary<int, Residencial> _residenciales = new()
    {
        [1] = new() { Id = 1, Nombre = "Residencial Los Almendros", Ubicacion = "Av. Independencia, Santo Domingo", Descripcion = "Residencial cerrado con piscina, áreas verdes, seguridad 24/7 y parqueo techado." },
        [2] = new() { Id = 2, Nombre = "Torres del Cibao", Ubicacion = "Av. Juan Pablo Duarte, Santiago de los Caballeros", Descripcion = "Torre moderna con gimnasio, ascensor, planta eléctrica y terraza social." }
    };

    private readonly Dictionary<int, Apartamento> _apartamentos = new()
    {
        [1] = new() { Id = 1, Numero = "A-101", Habitaciones = 2, Banos = 1, Precio = 4500000, Disponible = true, ResidencialId = 1 },
        [2] = new() { Id = 2, Numero = "A-202", Habitaciones = 3, Banos = 2, Precio = 6200000, Disponible = true, ResidencialId = 1 },
        [3] = new() { Id = 3, Numero = "B-301", Habitaciones = 3, Banos = 2, Precio = 5800000, Disponible = false, ResidencialId = 1 },
        [4] = new() { Id = 4, Numero = "1A", Habitaciones = 1, Banos = 1, Precio = 3200000, Disponible = true, ResidencialId = 2 },
        [5] = new() { Id = 5, Numero = "5C", Habitaciones = 2, Banos = 2, Precio = 4900000, Disponible = true, ResidencialId = 2 },
        [6] = new() { Id = 6, Numero = "PH-10", Habitaciones = 4, Banos = 3, Precio = 9500000, Disponible = true, ResidencialId = 2 }
    };

    // Los registros nuevos reciben un ID consecutivo mientras la API sigue abierta.
    private int _siguienteResidencial = 3;
    private int _siguienteApartamento = 7;

    public IEnumerable<Residencial> GetResidenciales()
    {
        lock (_sincronizacion) return _residenciales.Values.ToArray();
    }

    public Residencial? GetResidencialById(int id)
    {
        lock (_sincronizacion) return _residenciales.GetValueOrDefault(id);
    }

    public int CrearResidencial(Residencial residencial)
    {
        lock (_sincronizacion)
        {
            residencial.Id = _siguienteResidencial++;
            _residenciales.Add(residencial.Id, residencial);
            return residencial.Id;
        }
    }

    public bool ActualizarResidencial(int id, Residencial residencial)
    {
        lock (_sincronizacion)
        {
            if (!_residenciales.ContainsKey(id)) return false;

            residencial.Id = id;
            _residenciales[id] = residencial;
            return true;
        }
    }

    public bool EliminarResidencial(int id)
    {
        lock (_sincronizacion) return !TieneApartamentos(id) && _residenciales.Remove(id);
    }

    public bool TieneApartamentos(int id)
    {
        lock (_sincronizacion) return _apartamentos.Values.Any(apartamento => apartamento.ResidencialId == id);
    }

    public IEnumerable<Apartamento> GetApartamentos()
    {
        lock (_sincronizacion) return _apartamentos.Values.ToArray();
    }

    public Apartamento? GetApartamentoById(int id)
    {
        lock (_sincronizacion) return _apartamentos.GetValueOrDefault(id);
    }

    public int CrearApartamento(Apartamento apartamento)
    {
        lock (_sincronizacion)
        {
            ValidarResidencial(apartamento.ResidencialId);
            apartamento.Id = _siguienteApartamento++;
            _apartamentos.Add(apartamento.Id, apartamento);
            return apartamento.Id;
        }
    }

    public bool ActualizarApartamento(int id, Apartamento apartamento)
    {
        lock (_sincronizacion)
        {
            if (!_apartamentos.ContainsKey(id)) return false;

            ValidarResidencial(apartamento.ResidencialId);
            apartamento.Id = id;
            _apartamentos[id] = apartamento;
            return true;
        }
    }

    public bool EliminarApartamento(int id)
    {
        lock (_sincronizacion) return _apartamentos.Remove(id);
    }

    // Comprueba la relación con el residencial dentro de la operación protegida.
    private void ValidarResidencial(int id)
    {
        if (!_residenciales.ContainsKey(id))
        {
            throw new InvalidOperationException("El residencial indicado no existe.");
        }
    }
}
