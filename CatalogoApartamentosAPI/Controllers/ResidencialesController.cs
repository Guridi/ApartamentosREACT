using CatalogoApartamentosAPI.Interfaces;
using CatalogoApartamentosAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CatalogoApartamentosAPI.Controllers;

// Expone los endpoints de residenciales bajo /api/residenciales.
[ApiController]
[Route("api/[controller]")]
public class ResidencialesController : ControllerBase
{
    private readonly IResidencialService _residencialService;
    private readonly ILogger<ResidencialesController> _logger;
    private readonly IConfiguration _configuration;

    // Recibe por inyección de dependencias el servicio y las utilidades del controlador.
    public ResidencialesController(
        IResidencialService residencialService,
        ILogger<ResidencialesController> logger,
        IConfiguration configuration)
    {
        _residencialService = residencialService;
        _logger = logger;
        _configuration = configuration;
    }

    // Devuelve el listado de residenciales en JSON.
    [HttpGet]
    public IActionResult GetResidenciales()
    {
        _logger.LogInformation(
            "{Mensaje}",
            _configuration["MiConfiguracion:Mensaje"]);

        return Ok(_residencialService.GetResidenciales());
    }

    // Busca un residencial por ID y responde 404 si no existe.
    [HttpGet("{id:int}")]
    public IActionResult GetResidencialById(int id)
    {
        var residencial = _residencialService.GetResidencialById(id);

        if (residencial == null)
        {
            return NotFound("El residencial no existe.");
        }

        return Ok(residencial);
    }

    // Registra un residencial y responde 201 con un enlace al nuevo recurso.
    [HttpPost]
    public IActionResult CrearResidencial(Residencial residencial)
    {
        residencial.Id = _residencialService.CrearResidencial(residencial);

        _logger.LogInformation("Residencial creado.");

        return CreatedAtAction(
            nameof(GetResidencialById),
            new { id = residencial.Id },
            residencial);
    }

    // Reemplaza los datos del residencial indicado por la ruta.
    [HttpPut("{id:int}")]
    public IActionResult ActualizarResidencial(
        int id,
        Residencial residencial)
    {
        bool actualizado =
            _residencialService.ActualizarResidencial(id, residencial);

        if (!actualizado)
        {
            return NotFound("El residencial no existe.");
        }

        return NoContent();
    }

    // Impide eliminar un residencial que todavía tiene apartamentos.
    [HttpDelete("{id:int}")]
    public IActionResult EliminarResidencial(int id)
    {
        if (_residencialService.TieneApartamentos(id))
        {
            _logger.LogWarning(
                "No se puede eliminar el residencial {Id} porque tiene apartamentos.",
                id);

            return Conflict("No se puede eliminar un residencial que tiene apartamentos.");
        }

        bool eliminado =
            _residencialService.EliminarResidencial(id);

        if (!eliminado)
        {
            return NotFound("El residencial no existe.");
        }

        return NoContent();
    }
}