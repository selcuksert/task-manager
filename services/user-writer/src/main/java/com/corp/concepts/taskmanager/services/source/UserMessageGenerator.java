package com.corp.concepts.taskmanager.services.source;

import java.util.function.Supplier;

import org.springframework.context.annotation.Bean;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.KafkaNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import com.corp.concepts.taskmanager.models.User;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitFailureHandler;
import reactor.core.publisher.Sinks.Many;

@Service
@Slf4j(topic = "User Message Generator")
public class UserMessageGenerator {

	private final Many<Message<?>> processor = Sinks.many().multicast().onBackpressureBuffer();

	public void emitMessage(User user) {
		Message<User> message = MessageBuilder.withPayload(user).build();

		processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

		log.info("Message sent");
	}

	public void deleteMessage(String id) {
		// Use tombstone message to remove item data from Kafka
		Message<KafkaNull> message = MessageBuilder.withPayload(KafkaNull.INSTANCE)
				.setHeader(KafkaHeaders.MESSAGE_KEY, id).build();

		processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

		log.info("Message sent");
	}

	@Bean
	public Supplier<Flux<?>> output() {
		return () -> processor.asFlux();
	}

}
