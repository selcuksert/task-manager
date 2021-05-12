package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.services.model.Task;
import com.corp.concepts.taskmanager.services.repo.TaskRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/reader")
public class TaskController {
	private final TaskRepository taskRepository;

	public TaskController(TaskRepository taskRepository) {
		this.taskRepository = taskRepository;
	}

	@GetMapping
	@ResponseBody
	public Iterable<Task> get() {
		try {
			return taskRepository.findAll();
		} catch (Exception e) {
			log.error("Error during getting user list:", e);
		}

		return Collections.emptyList();
	}

}
