# Imagen base con Java 21 (oficial y estable)
FROM eclipse-temurin:21-jdk-jammy

# Instalar Maven
RUN apt-get update && apt-get install -y maven

# Establecer directorio de trabajo
WORKDIR /app

# Copiar solo el backend al contenedor
COPY backend/hoteleria ./

# Compilar el proyecto (sin tests para acelerar)
RUN mvn clean package -DskipTests

# Exponer el puerto del backend
EXPOSE 9000

# Ejecutar el JAR (ajusta el nombre si cambia)
CMD ["java", "-jar", "target/hoteleria-0.0.1-SNAPSHOT.jar"]
