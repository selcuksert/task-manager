package com.corp.concepts.taskmanager.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {
	
	private int code;
	private String message;
	private boolean error;

}
