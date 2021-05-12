package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.common.Response;
import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.TaskState;
import com.corp.concepts.taskmanager.services.source.TaskMessageGenerator;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/writer")
public class TaskController {
	private final TaskMessageGenerator taskMessageGenerator;
	private static final String SUCCESS_MESSAGE = "Request processed";
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
