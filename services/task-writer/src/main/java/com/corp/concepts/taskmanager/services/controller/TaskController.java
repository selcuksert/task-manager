package com.corp.concepts.taskmanager.services.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.common.Response;
import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.TaskState;
import com.corp.concepts.taskmanager.services.source.TaskMessageGenerator;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/task/writer")
public class TaskController {
	private final TaskMessageGenerator taskMessageGenerator;
	private static final String SUCCESS_MESSAGE = "Processed request";
	private static final String ERROR_MESSAGE = "Error during sending message to broker:";

	public TaskController(TaskMessageGenerator taskMessageGenerator) {
		this.taskMessageGenerator = taskMessageGenerator;
	}

	@PostMapping
	@ResponseBody
	public Response add(@RequestBody Task task) {
		try {
			task.setStatus(TaskState.NOTSTARTED);
			task.setId(UUID.randomUUID().toString());
			taskMessageGenerator.emitMessage(task);
			return new Response(100, SUCCESS_MESSAGE, false);
		} catch (Exception e) {
			log.error(ERROR_MESSAGE, e);
			return new Response(999, e.getMessage(), true);
		}
	}

	@PutMapping
	@ResponseBody
	public Response update(@RequestBody Task task) {
		try {
			taskMessageGenerator.emitMessage(task);
			return new Response(100, SUCCESS_MESSAGE, false);
		} catch (Exception e) {
			log.error(ERROR_MESSAGE, e);
			return new Response(999, e.getMessage(), true);
		}
	}

	@DeleteMapping
	@ResponseBody
	public Response delete(@RequestBody String taskId) {
		try {
			taskMessageGenerator.deleteMessage(taskId);
			return new Response(100, SUCCESS_MESSAGE, false);
		} catch (Exception e) {
			log.error(ERROR_MESSAGE, e);
			return new Response(999, e.getMessage(), true);
		}
	}

}
