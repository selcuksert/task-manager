package com.corp.concepts.taskmanager.services.source;

import java.util.function.Supplier;

import org.springframework.context.annotation.Bean;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.KafkaNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import com.corp.concepts.taskmanager.models.Task;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitFailureHandler;
import reactor.core.publisher.Sinks.Many;

@Service
@Slf4j(topic = "Task Message Generator")
public class TaskMessageGenerator {

	private final Many<Message<?>> processor = Sinks.many().multicast().onBackpressureBuffer();

	public void emitMessage(Task task) {
		Message<Task> message = MessageBuilder.withPayload(task).build();

		processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

		log.info("Message sent");
	}

	public void deleteMessage(String taskId) {
		// Use tombstone message to remove item data from Kafka
		Message<KafkaNull> message = MessageBuilder.withPayload(KafkaNull.INSTANCE)
				.setHeader(KafkaHeaders.MESSAGE_KEY, taskId).build();

		processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

		log.info("Message sent");
	}

	@Bean
	public Supplier<Flux<?>> output() {
		return () -> processor.asFlux();
	}

}
