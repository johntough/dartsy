package com.tough.matchcompletionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class MatchCompletionServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MatchCompletionServiceApplication.class, args);
    }

}
