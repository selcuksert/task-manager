package com.corp.concepts.taskmanager.services.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

	public TaskController(TaskMessageGenerator taskMessageGenerator) {
		this.taskMessageGenerator = taskMessageGenerator;
	}

	@PostMapping
	@ResponseBody
	public Response sendItemMessage(@RequestBody Task task) {
		try {
			task.setStatus(TaskState.NOTSTARTED);
			task.setId(UUID.randomUUID().toString());
			taskMessageGenerator.emitMessage(task);
			return new Response(100, "Processed request", false);
		} catch (Exception e) {
			log.error("Error during sending message to broker:", e);
			return new Response(999, e.getMessage(), true);
		}
	}

	@DeleteMapping
	@ResponseBody
	public Response deleteItemMessage(@RequestBody Long taskId) {
		try {
			taskMessageGenerator.deleteMessage(taskId);
			return new Response(100, "Processed request", false);
		} catch (Exception e) {
			log.error("Error during sending message to broker:", e);
			return new Response(999, e.getMessage(), true);
		}
	}

}
