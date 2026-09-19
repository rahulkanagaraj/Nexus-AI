# ==============================================================================
# Nexus-AI Spring Boot Backend - Production Multi-Stage Dockerfile (Render Optimized)
# ==============================================================================

# Stage 1: Build JAR with Maven & OpenJDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Set Maven Memory limits to fit within Render 512MB RAM build limit
ENV MAVEN_OPTS="-Xmx384m"

# Copy project definition and source files
COPY pom.xml .
COPY src ./src

# Package production application artifact
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

# Low-memory JVM tuning for Render Free Tier (512MB RAM)
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=dev \
    JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
