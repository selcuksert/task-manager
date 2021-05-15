package com.corp.concepts.taskmanager.services.processor;

import com.corp.concepts.taskmanager.models.DetailedTask;
import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.TaskState;
import com.corp.concepts.taskmanager.models.User;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.streams.kstream.GlobalKTable;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.KTable;
import org.apache.kafka.streams.kstream.Materialized;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.support.KafkaStreamBrancher;
import org.springframework.stereotype.Component;

import java.util.function.BiConsumer;
import java.util.function.BiFunction;

@Component
@Log4j2
public class TaskProcessor {

    @Value("${custom.ktable.detail}")
    private String detailTable;

    @Bean
    public BiConsumer<KStream<String, Task>, KStream<String, User>> log() {
        return (taskStream, userStream) -> {
            KafkaStreamBrancher<String, Task> taskStreamBrancher = new KafkaStreamBrancher<>();

            taskStreamBrancher
                    .branch((key, task) -> (task != null && task.getStatus().compareTo(TaskState.COMPLETED) == 0),
                            ks -> ks.peek((key, task) -> log.info("COMPLETED | key: {} | task: {}", key, task)))
                    .branch((key, task) -> (task != null && task.getStatus().compareTo(TaskState.COMPLETED) != 0),
                            ks -> ks.peek((key, task) -> log.info("IN-COMPLETE | key: {} | task: {}", key, task)))
                    .defaultBranch(ks -> ks.peek((key, task) -> log.info("DELETED | key: {}", key)))
                    .onTopOf(taskStream);

            userStream.peek((key, user) -> log.info("USER ADDED | key: {} | user: {}", key, user));
        };
    }

    @Bean
    public BiFunction<KStream<String, Task>, GlobalKTable<String, User>, KTable<String, DetailedTask>> detail() {
        return (taskStream, userTable) ->
                taskStream.leftJoin(userTable, (key, task) -> task.getUserid(), (task, user) -> {
                    DetailedTask dt = new DetailedTask();
                    dt.setFirstname(user.getFirstname());
                    dt.setLastname(user.getLastname());
                    dt.setDetails(task.getDetails());
                    dt.setDuedate(task.getDuedate());
                    dt.setId(task.getId());
                    dt.setTitle(task.getTitle());
                    dt.setStatus(task.getStatus());

                    return dt;
                }).toTable(Materialized.as(detailTable));
    }
}
