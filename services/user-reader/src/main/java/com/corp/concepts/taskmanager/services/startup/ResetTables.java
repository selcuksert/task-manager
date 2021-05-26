package com.corp.concepts.taskmanager.services.startup;

import com.corp.concepts.taskmanager.services.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(value = "custom.reset.tables", havingValue = "true", matchIfMissing = false)
public class ResetTables implements CommandLineRunner {
    private final UserRepository userRepository;

    public ResetTables(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.deleteAll();
    }
}
