package com.corp.concepts.taskmanager.services.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.corp.concepts.taskmanager.common.Response;
import com.corp.concepts.taskmanager.models.User;
import com.corp.concepts.taskmanager.services.source.UserMessageGenerator;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api/user/writer")
public class UserController {
    private final UserMessageGenerator userMessageGenerator;
    private static final String SUCCESS_MESSAGE = "Request processed";
    private static final String ERROR_MESSAGE = "Error during sending message to broker:";

    public UserController(UserMessageGenerator userMessageGenerator) {
        this.userMessageGenerator = userMessageGenerator;
    }

    @PostMapping
    @ResponseBody
    public Response add(@RequestBody User user) {
        try {
            userMessageGenerator.emitMessage(user);
            return new Response(100, SUCCESS_MESSAGE, false);
        } catch (Exception e) {
            log.error(ERROR_MESSAGE, e);
            return new Response(999, e.getMessage(), true);
        }
    }

    @DeleteMapping
    @ResponseBody
    public Response delete(@RequestBody String id) {
        try {
            userMessageGenerator.deleteMessage(id);
            return new Response(100, SUCCESS_MESSAGE, false);
        } catch (Exception e) {
            log.error(ERROR_MESSAGE, e);
            return new Response(999, e.getMessage(), true);
        }
    }

}
