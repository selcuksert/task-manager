package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.services.model.User;
import com.corp.concepts.taskmanager.services.repo.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@Slf4j
@RestController
@RequestMapping(value = "/api/user/reader")
public class UserController {
	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping
	@ResponseBody
	public Iterable<User> get() {
		try {
			return userRepository.findAll();
		} catch (Exception e) {
			log.error("Error during getting user list:", e);
		}
		
		return Collections.emptyList();
	}

}
