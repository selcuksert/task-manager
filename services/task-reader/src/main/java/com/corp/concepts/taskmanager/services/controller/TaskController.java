package com.corp.concepts.taskmanager.services.controller;

import java.util.Collections;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.services.model.Task;
import com.corp.concepts.taskmanager.services.repo.TaskRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
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
