package com.corp.concepts.taskmanager.services.processor;

import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.TaskState;
import com.corp.concepts.taskmanager.models.User;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.support.KafkaStreamBrancher;
import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;

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
            KafkaStreamBrancher<String, Task> taskStreamBrancher = new KafkaStreamBrancher<>();

            taskStreamBrancher
                    .branch((key, task) -> (task != null && task.getStatus().compareTo(TaskState.COMPLETED) == 0),
                            ks -> ks.peek((key, task) -> log.info("COMPLETED | key: {} | task: {}", key, task)))
                    .branch((key, task) -> (task != null && task.getStatus().compareTo(TaskState.COMPLETED) != 0),
                            ks -> ks.peek((key, task) -> log.info("IN-COMPLETE | key: {} | task: {}", key, task)))
                    .defaultBranch(ks -> ks.peek((key, task) -> log.info("DELETED | key: {}", key)))
                    .onTopOf(taskStream);

            taskStream.toTable(Materialized.as(taskTable)).toStream();

            userStream.peek((key, user) -> log.info("key: {} | user: {}", key, user))
                    .toTable(Materialized.as(userTable)).toStream();
        };
    }
}
