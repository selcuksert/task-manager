package com.corp.concepts.taskmanager.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.schema.registry.client.EnableSchemaRegistryClient;

@SpringBootApplication
@EnableSchemaRegistryClient
public class TaskWriterApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskWriterApplication.class, args);
	}

}
