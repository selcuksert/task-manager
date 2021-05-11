package com.corp.concepts.taskmanager.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class TaskProcessorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskProcessorApplication.class, args);
	}

}
