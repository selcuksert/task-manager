package com.corp.concepts.taskmanager.services.processor;

import java.util.function.BiConsumer;

import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.User;

import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class TaskProcessor {

	@Value("${custom.ktable.tasks}")
	private String taskTable;

	@Value("${custom.ktable.users}")
	private String userTable;

	@Bean
	public BiConsumer<KStream<String, Task>, KStream<String, User>> process() {
		return (taskStream, userStream) -> {
			taskStream.peek((key, task) -> log.info("key: {} | task: {}", key, task))
					.toTable(Materialized.as(taskTable)).toStream();
			userStream.peek((key, user) -> log.info("key: {} | user: {}", key, user))
					.toTable(Materialized.as(userTable)).toStream();
		};
	}
}
