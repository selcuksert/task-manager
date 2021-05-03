package com.corp.concepts.taskmanager.services.repo;

import org.springframework.data.repository.CrudRepository;

import com.corp.concepts.taskmanager.services.model.Task;

public interface TaskRepository extends CrudRepository<Task, String> {

}
