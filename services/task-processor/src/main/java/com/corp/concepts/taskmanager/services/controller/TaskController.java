package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.models.DetailedTask;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/processor")
public class TaskController {

    private final InteractiveQueryService interactiveQueryService;
    @Value("${custom.ktable.detail}")
    private String detailTable;

    public TaskController(InteractiveQueryService interactiveQueryService) {
        this.interactiveQueryService = interactiveQueryService;
    }

    @GetMapping
    @ResponseBody
    public String getTaskById(@RequestParam(value = "taskId") String taskId) {
        DetailedTask detailedTask = null;

        try {
            ReadOnlyKeyValueStore<String, DetailedTask> detailStore = interactiveQueryService.getQueryableStore(detailTable,
                    QueryableStoreTypes.keyValueStore());

            detailedTask = detailStore.get(taskId);

            if (detailedTask == null) {
                detailedTask = new DetailedTask();
            }
        } catch (Exception e) {
            log.error("Error:", e);
        }

        return detailedTask.toString();
    }
}
