package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.models.DetailedTask;
import com.corp.concepts.taskmanager.services.service.QueryService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/processor")
public class TaskController {

    private final QueryService queryService;
    @Value("${custom.ktable.detail}")
    private String detailTable;
    @Value("${custom.ktable.count}")
    private String countTable;

    public TaskController(QueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/detail")
    @ResponseBody
    public String getTaskById(@RequestParam(value = "taskId") String taskId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return queryService.getMaterializedData(DetailedTask.class, detailTable, taskId, "/api/task/processor/detail", "taskId", authHeader).toString();
    }

    @GetMapping("/count")
    @ResponseBody
    public Long getTaskCountByUserId(@RequestParam(value = "userId") String userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        return queryService.getMaterializedData(Long.class, countTable, userId, "/api/task/processor/count", "userId", authHeader);
    }

}
