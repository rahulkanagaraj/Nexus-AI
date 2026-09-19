# ==============================================================================
# Nexus-AI Spring Boot Backend - Production Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build JAR with Maven & OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compile and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimalist Lightweight JRE Runner
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create non-privileged service user
RUN addgroup -S nexus-ai && adduser -S nexus-ai -G nexus-ai && \
    mkdir -p /app/uploads && chown -R nexus-ai:nexus-ai /app

USER nexus-ai:nexus-ai

# Copy compiled jar from builder
COPY --from=builder /build/target/*.jar app.jar

# Environment defaults (can be overridden at runtime)
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
