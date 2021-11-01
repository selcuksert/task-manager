package com.corp.concepts.taskmanager.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@AllArgsConstructor
public class Response {

	public static final String SUCCESS_MESSAGE = "Request processed";
	public static final String ERROR_MESSAGE = "Error during sending message to broker:";

	private int code;
	private String message;
	private boolean error;

	public enum Code {
		FAIL(999), SUCCESS(100);

		@Getter
		private final int value;

		Code(int value) {
			this.value = value;
		}
	}
}
