# 🎬 NextWatch AI

A modern movie recommendation app showcasing **advanced .NET** backend skills, AI integration, and a sleek React frontend

🌐 Live Version Deployed on Azure App Service: https://nextwatch-ai-e5frangmf4ebcuc0.canadacentral-01.azurewebsites.net

---

## 🔑 Key Features

- **Fluent-API EF Core**  
  - Unique `(UserId, MovieId)` index  
  - Cascade delete, optional **Note** field  
- **JWT Authentication**  
  - ASP.NET Core Identity + JWT Bearer  
  - Stateless, secure token‐based auth (configurable expiry)
- **Modern Web API**  
  - .NET 9 controllers  
  - CORS locked to front-end origins  
  - OpenAPI/Swagger for interactive docs
- **AI-Powered Recommendations**  
  - `IAiRecommendationService` backed by OpenAI GPT  
  - Contextual movie suggestions on demand
- **React + TypeScript Frontend**  
  - Vite dev server & production build  
  - TailwindCSS with **safe-area** support  
  - Debounced search (TMDB proxy) + auto-saving notes
- **CI/CD & Cloud**  
  - GitHub Actions → Azure App Service & Azure SQL (Free Tiers)  
  - App settings secure connection strings & keys

---

## 🚀 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Backend     | .NET 9, ASP.NET Core Web API |
| Persistence | EF Core 9 (Fluent API)        |
| Auth        | ASP.NET Identity, JWT         |
| AI          | OpenAI GPT                    |
| Frontend    | React 18, Vite, TypeScript    |
| Styling     | TailwindCSS                   |
| Infra       | Azure App Service, Azure SQL  |
| CI/CD       | GitHub Actions                |

---

## 🏁 Getting Started

1. **Clone & configure**  
git clone https://github.com/your-org/NextWatchAI.git
cd NextWatchAI/server

# Set up secrets
dotnet user-secrets set "Jwt:Key" "<your-jwt-secret>"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your-connection-string>"
dotnet user-secrets set "TMDB:ApiKey" "<your-tmdb-api-key>"
dotnet user-secrets set "OpenAI:ApiKey" "<your-openai-api-key>"

# Run migrations and start the server
dotnet ef database update
dotnet run
