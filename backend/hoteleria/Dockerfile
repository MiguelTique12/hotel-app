# Imagen base con Java 17
FROM openjdk:17-jdk-slim

# Instalar Maven (por si no está incluido)
RUN apt-get update && apt-get install -y maven

# Crear carpeta de trabajo
WORKDIR /app

# Copiar los archivos de tu proyecto al contenedor
COPY . .

# Compilar el proyecto
RUN mvn clean package -DskipTests

# Exponer el puerto de tu app
EXPOSE 9000

# Ejecutar la app (ajusta el nombre del JAR si cambia)
CMD ["java", "-jar", "target/hoteleria-0.0.1-SNAPSHOT.jar"]
