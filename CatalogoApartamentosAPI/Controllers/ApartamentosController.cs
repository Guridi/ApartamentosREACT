using CatalogoApartamentosAPI.Interfaces;
using CatalogoApartamentosAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CatalogoApartamentosAPI.Controllers;

// Expone los endpoints de apartamentos bajo /api/apartamentos.
[ApiController]
[Route("api/[controller]")]
public class ApartamentosController : ControllerBase
{
    private readonly IApartamentoService _apartamentoService;
    private readonly IResidencialService _residencialService;
    private readonly ILogger<ApartamentosController> _logger;

    // Recibe por inyección de dependencias el servicio y las utilidades del controlador.
    public ApartamentosController(
        IApartamentoService apartamentoService,
        IResidencialService residencialService,
        ILogger<ApartamentosController> logger)
    {
        _apartamentoService = apartamentoService;
        _residencialService = residencialService;
        _logger = logger;
    }

    // Devuelve el listado de apartamentos en JSON.
    [HttpGet]
    public IActionResult GetApartamentos()
    {
        _logger.LogInformation("Consulta del listado de apartamentos.");

        return Ok(_apartamentoService.GetApartamentos());
    }

    // Busca un apartamento por ID y responde 404 si no existe.
    [HttpGet("{id:int}")]
    public IActionResult GetApartamentoById(int id)
    {
        var apartamento =
            _apartamentoService.GetApartamentoById(id);

        if (apartamento == null)
        {
            return NotFound("El apartamento no existe.");
        }

        return Ok(apartamento);
    }

    // Registra un apartamento y responde 201 con un enlace al nuevo recurso.
    [HttpPost]
    public IActionResult CrearApartamento(Apartamento apartamento)
    {
        var residencial =
            _residencialService.GetResidencialById(
                apartamento.ResidencialId);

        if (residencial == null)
        {
            return BadRequest("El residencial indicado no existe.");
        }

        apartamento.Id =
            _apartamentoService.CrearApartamento(apartamento);

        _logger.LogInformation("Apartamento creado.");

        return CreatedAtAction(
            nameof(GetApartamentoById),
            new { id = apartamento.Id },
            apartamento);
    }

    // Reemplaza los datos del apartamento indicado por la ruta.
    [HttpPut("{id:int}")]
    public IActionResult ActualizarApartamento(
        int id,
        Apartamento apartamento)
    {
        var residencial =
            _residencialService.GetResidencialById(
                apartamento.ResidencialId);

        if (residencial == null)
        {
            return BadRequest("El residencial indicado no existe.");
        }

        bool actualizado =
            _apartamentoService.ActualizarApartamento(
                id,
                apartamento);

        if (!actualizado)
        {
            return NotFound("El apartamento no existe.");
        }

        return NoContent();
    }

    // Elimina el apartamento y devuelve 204 si se eliminó correctamente.
    [HttpDelete("{id:int}")]
    public IActionResult EliminarApartamento(int id)
    {
        bool eliminado =
            _apartamentoService.EliminarApartamento(id);

        if (!eliminado)
        {
            return NotFound("El apartamento no existe.");
        }

        return NoContent();
    }
}