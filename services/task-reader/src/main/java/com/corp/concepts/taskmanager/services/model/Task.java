package com.corp.concepts.taskmanager.services.model;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity(name = "tasks")
public class Task {

	@Getter
	@Setter
	@Id
	private String id;

	@Getter
	@Setter
	private String userid;

	@Getter
	@Setter
	private String duedate;

	@Getter
	@Setter
	private String title;

	@Getter
	@Setter
	private String details;

	@Getter
	@Setter
	private String status;

}
