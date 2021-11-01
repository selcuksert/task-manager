package com.corp.concepts.taskmanager.services.repo;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.corp.concepts.taskmanager.services.model.Task;

public interface TaskRepository extends PagingAndSortingRepository<Task, String> {

	List<Task> findAllByUserid(String userid);

}
