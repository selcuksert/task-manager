package com.corp.concepts.taskmanager.services.repo;

import org.springframework.data.repository.CrudRepository;

import com.corp.concepts.taskmanager.services.model.User;

public interface UserRepository extends CrudRepository<User, String> {

}
