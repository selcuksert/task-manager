package com.corp.concepts.taskmanager.services.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.models.DetailedTask;
import com.corp.concepts.taskmanager.services.service.QueryService;

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
	public String getTaskById(@RequestParam(value = "taskId") String taskId,
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
		return queryService.getMaterializedData(DetailedTask.class, detailTable, taskId, "/api/task/processor/detail",
				"taskId", authHeader).toString();
	}

	@GetMapping("/count")
	@ResponseBody
	public Long getTaskCountByUserId(@RequestParam(value = "userId") String userId,
			@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
		return queryService.getMaterializedData(Long.class, countTable, userId, "/api/task/processor/count", "userId",
				authHeader);
	}

}
