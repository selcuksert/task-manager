package com.corp.concepts.taskmanager.services.controller;

import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.models.Task;
import com.corp.concepts.taskmanager.models.User;
import com.corp.concepts.taskmanager.services.model.DetailedTask;

import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/processor")
public class TaskController {

	@Value("${custom.ktable.tasks}")
	private String taskTable;

	@Value("${custom.ktable.users}")
	private String userTable;

	private InteractiveQueryService interactiveQueryService;

	public TaskController(InteractiveQueryService interactiveQueryService) {
		this.interactiveQueryService = interactiveQueryService;
	}

	@GetMapping
	@ResponseBody
	public DetailedTask getTaskById(@RequestParam(value = "taskId") String taskId) {
		Task task = null;
		User user = null;
		DetailedTask detailedTask = new DetailedTask();

		try {
			ReadOnlyKeyValueStore<String, User> userStore = interactiveQueryService.getQueryableStore(userTable,
					QueryableStoreTypes.<String, User>keyValueStore());

			ReadOnlyKeyValueStore<String, Task> taskStore = interactiveQueryService.getQueryableStore(taskTable,
					QueryableStoreTypes.<String, Task>keyValueStore());

			task = taskStore.get(taskId);
			if (task != null) {
				user = userStore.get(task.getUserid());

				if (user != null) {
					detailedTask.setId(task.getId());
					detailedTask.setDetails(task.getDetails());
					detailedTask.setDuedate(task.getDuedate());
					detailedTask.setFirstName(user.getFirstname());
					detailedTask.setLastName(user.getLastname());
					detailedTask.setStatus(task.getStatus().toString());
					detailedTask.setTitle(task.getTitle());
				}
			}

		} catch (Exception e) {
			log.error("Error: ", e);
		}

		return detailedTask;
	}

}
