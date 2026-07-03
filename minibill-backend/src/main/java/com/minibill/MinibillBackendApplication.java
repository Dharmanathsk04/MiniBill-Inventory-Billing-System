package com.minibill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MinibillBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MinibillBackendApplication.class, args);
        System.out.println(" MiniBill Backend Started Successfully!");
        System.out.println(" API available at: http://localhost:8080/api");
    }
}