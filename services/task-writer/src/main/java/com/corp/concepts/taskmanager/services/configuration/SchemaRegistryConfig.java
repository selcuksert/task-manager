package com.corp.concepts.taskmanager.services.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.schema.registry.client.ConfluentSchemaRegistryClient;
import org.springframework.cloud.schema.registry.client.SchemaRegistryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SchemaRegistryConfig {

	@Bean
	public SchemaRegistryClient schemaRegistryClient(
			@Value("${spring.cloud.stream.kafka.binder.producer-properties[schema.registry.url]}") String endpoint) {
		ConfluentSchemaRegistryClient client = new ConfluentSchemaRegistryClient();
		client.setEndpoint(endpoint);
		return client;
	}
}
