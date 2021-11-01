package com.corp.concepts.taskmanager.services.startup;

import com.corp.concepts.taskmanager.services.repo.TaskRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(value = "custom.reset.tables", havingValue = "true", matchIfMissing = false)
@Log4j2
public class ResetTables implements CommandLineRunner {
    private final TaskRepository taskRepository;

    public ResetTables(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            taskRepository.deleteAll();
        }
        catch (Exception e) {
            log.warn("Exception occurred, but ignoring to avoid startup failure: {}", e.getLocalizedMessage());
        }
    }
}
