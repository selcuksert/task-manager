package com.corp.concepts.taskmanager.services.controller;

import java.util.Collections;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.services.model.Task;
import com.corp.concepts.taskmanager.services.repo.TaskRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/reader")
public class TaskController {
	private final TaskRepository taskRepository;

	public TaskController(TaskRepository taskRepository) {
		this.taskRepository = taskRepository;
	}

	@GetMapping("/all")
	@ResponseBody
	public Iterable<Task> getAll() {
		try {
			return taskRepository.findAll();
		} catch (Exception e) {
			log.error("Error during getting user list:", e);
		}

		return Collections.emptyList();
	}

	@GetMapping("/owned")
	@ResponseBody
	public Iterable<Task> getByUserId(JwtAuthenticationToken token) {
		try {
			Jwt principal = (Jwt) token.getPrincipal();
			String userId = principal.getClaimAsString("preferred_username");
			return taskRepository.findAllByUserid(userId);
		} catch (Exception e) {
			log.error("Error during getting user list:", e);
		}

		return Collections.emptyList();
	}

}
