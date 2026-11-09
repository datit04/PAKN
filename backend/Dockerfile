FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and csproj files for optimal layer caching
COPY PAKN.sln ./
COPY src/Core/PAKN.Domain/*.csproj ./src/Core/PAKN.Domain/
COPY src/Core/PAKN.Application/*.csproj ./src/Core/PAKN.Application/
COPY src/Infrastructure/PAKN.Infrastructure/*.csproj ./src/Infrastructure/PAKN.Infrastructure/
COPY src/Presentation/PAKN.WebAPI/*.csproj ./src/Presentation/PAKN.WebAPI/

RUN dotnet restore PAKN.sln

# Copy the remaining source files
COPY . .

# Publish WebAPI in Release mode
RUN dotnet publish src/Presentation/PAKN.WebAPI/PAKN.WebAPI.csproj -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Environment config
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000

ENTRYPOINT ["dotnet", "PAKN.WebAPI.dll"]

