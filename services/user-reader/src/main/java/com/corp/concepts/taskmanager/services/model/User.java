package com.corp.concepts.taskmanager.services.model;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity(name = "users")
public class User {

	@Getter
	@Setter
	@Id
	private String id;

	@Getter
	@Setter
	private String firstname;

	@Getter
	@Setter
	private String lastname;

}
