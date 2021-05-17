package com.corp.concepts.taskmanager.services.repo;

import com.corp.concepts.taskmanager.services.model.Task;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TaskRepository extends CrudRepository<Task, String> {

    List<Task> findAllByUserid(String userid);

}
