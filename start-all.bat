@echo off
echo Starting Nexus-AI Full Stack (Backend + Frontend + Ollama)...

echo Starting Spring Boot Backend...
start "Nexus-AI Backend" cmd /k "cd BackEnd && "C:\Users\Manoranjan M\maven\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run -Dspring-boot.run.profiles=dev"

echo Starting Vite Frontend...
start "Nexus-AI Frontend" cmd /k "npm run dev"

echo Warming up Ollama llama3.2...
start "Nexus-AI Ollama" cmd /k "ollama run llama3.2"

echo All services launched!
echo Frontend: http://localhost:3000 (or http://localhost:3001)
echo Backend:  http://localhost:8080
echo Ollama:   http://localhost:11434
