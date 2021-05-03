package com.corp.concepts.taskmanager.services.model;

import lombok.Data;

@Data
public class DetailedTask {

	private String id;
	private String firstName;
	private String lastName;
	private String title;
	private String details;
	private String duedate;
	private String status;

}
