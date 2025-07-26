FROM openjdk:21-jdk

WORKDIR /app

COPY target/dartsapp-match-completion-service-0.0.1-SNAPSHOT.jar /app/dartsapp-match-completion-service-0.0.1-SNAPSHOT.jar

EXPOSE 3001

CMD ["java", "-jar", "/app/dartsapp-match-completion-service-0.0.1-SNAPSHOT.jar"]