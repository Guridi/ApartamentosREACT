using CatalogoApartamentosAPI.Interfaces;
using CatalogoApartamentosAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Registra los controladores y la documentación de los endpoints.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// El perfil de demostración comparte un catálogo en memoria. El otro usa SQL Server.
if (builder.Environment.IsDevelopment() && builder.Configuration.GetValue<bool>("Catalogo:UsarDatosDemo"))
{
    builder.Services.AddSingleton<CatalogoDemostracion>();
    builder.Services.AddSingleton<IResidencialService>(services => services.GetRequiredService<CatalogoDemostracion>());
    builder.Services.AddSingleton<IApartamentoService>(services => services.GetRequiredService<CatalogoDemostracion>());
}
else
{
    builder.Services.AddScoped<IResidencialService, ResidencialService>();
    builder.Services.AddScoped<IApartamentoService, ApartamentoService>();
}

var app = builder.Build();

// Habilita Swagger y OpenAPI durante el desarrollo.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// En desarrollo se permite el HTTP local que usa el proxy de React.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthorization();
// Habilita las rutas declaradas en los controladores.
app.MapControllers();
app.Run();
