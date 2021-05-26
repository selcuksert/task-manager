package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.services.service.QueryService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/processor")
public class TaskController {

    @Value("${custom.ktable.detail}")
    private String detailTable;

    private final QueryService queryService;

    public TaskController(QueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    @ResponseBody
    public String getTaskById(@RequestParam(value = "taskId") String taskId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
            return queryService.getMaterializedData(detailTable, taskId, authHeader).toString();
    }

}
