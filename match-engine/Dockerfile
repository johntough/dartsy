FROM openjdk:21-jdk

WORKDIR /app

COPY target/match-engine-0.0.1-SNAPSHOT.jar /app/match-engine-0.0.1-SNAPSHOT.jar

EXPOSE 3001

CMD ["java", "-jar", "/app/match-engine-0.0.1-SNAPSHOT.jar"]