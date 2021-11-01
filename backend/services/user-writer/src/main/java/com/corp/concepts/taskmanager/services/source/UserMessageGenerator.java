package com.corp.concepts.taskmanager.services.source;

import com.corp.concepts.taskmanager.models.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.KafkaNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitFailureHandler;
import reactor.core.publisher.Sinks.Many;

import java.util.function.Supplier;

@Service
@Log4j2(topic = "User Message Generator")
public class UserMessageGenerator {

    private final Many<Message<?>> processor = Sinks.many().multicast().onBackpressureBuffer();

    public void emitMessage(User user) {
        Message<User> message = MessageBuilder.withPayload(user).setHeader(KafkaHeaders.MESSAGE_KEY, user.getId()).build();

        processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

        log.info("Message sent: {}", message);
    }

    public void deleteMessage(String id) {
        // Use tombstone message to remove user data from Kafka
        Message<KafkaNull> message = MessageBuilder.withPayload(KafkaNull.INSTANCE)
                .setHeader(KafkaHeaders.MESSAGE_KEY, id).build();

        processor.emitNext(message, EmitFailureHandler.FAIL_FAST);

        log.info("Message sent: {}", message);
    }

    @Bean
    public Supplier<Flux<Message<?>>> output() {
        return () -> processor.asFlux();
    }

}
