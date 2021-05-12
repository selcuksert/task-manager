package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.common.Response;
import com.corp.concepts.taskmanager.models.User;
import com.corp.concepts.taskmanager.services.source.UserMessageGenerator;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

@Log4j2
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
