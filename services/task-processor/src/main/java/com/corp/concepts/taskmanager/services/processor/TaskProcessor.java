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

    /**
     * Processor topology to join task stream with global KTable of user data.
     * When a message on task topic is consumed it is left joined with global KTable of users
     * in case of userId of task has matches with the id of user in KTable.
     *
     * As the keyspace of user data (key: username) is not so big and has low cardinality,
     * the un-partitioned version of KTable, GlobalKTable is selected.
     *
     * As the detailed task data has high cardinality (key: uuid) and expected to grow into a
     * large keyspace the output of processing is materialized as KTable
     *
     * @return KTable of detailed task table.
     */
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
