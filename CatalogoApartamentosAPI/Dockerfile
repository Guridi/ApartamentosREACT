# Compila la API con el SDK de .NET 10.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY CatalogoApartamentosAPI.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o /app --no-restore

# Ejecuta la API con el runtime de ASP.NET Core.
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app ./
ENV ASPNETCORE_URLS=http://+:5143
EXPOSE 5143
ENTRYPOINT ["dotnet", "CatalogoApartamentosAPI.dll"]
