package com.corp.concepts.taskmanager.services.controller;

import com.corp.concepts.taskmanager.models.DetailedTask;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyQueryMetadata;
import org.apache.kafka.streams.state.HostInfo;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Log4j2
@RestController
@RequestMapping(value = "/api/task/processor")
public class TaskController {

    private final InteractiveQueryService interactiveQueryService;
    @Value("${custom.ktable.detail}")
    private String detailTable;

    public TaskController(InteractiveQueryService interactiveQueryService) {
        this.interactiveQueryService = interactiveQueryService;
    }

    @GetMapping
    @ResponseBody
    public String getTaskById(@RequestParam(value = "taskId") String taskId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        DetailedTask detailedTask = null;

        try {
            ReadOnlyKeyValueStore<String, DetailedTask> detailStore = interactiveQueryService.getQueryableStore(detailTable,
                    QueryableStoreTypes.keyValueStore());

            detailedTask = detailStore.get(taskId);
        } catch (Exception e) {
            log.error("Error:", e);
        }

        if (detailedTask == null) {
            detailedTask = getDataFromOtherHost(taskId, authHeader);
        }

        return detailedTask.toString();
    }

    /**
     * This method is for getting DetailedTask data with a key that does not exist
     * in local KTable store from related Kafka Stream processor instance by using metadata for given key.
     * <p>
     * With this information the function builds the correct REST endpoint for this instance
     * and invokes an HTTP GET request with it and returns response.
     *
     * @param key        taskId
     * @param authHeader Authorization header that contains JWT
     * @return Retrieved task data from other KStream apps. Returns empty object if there is no data retrieved.
     */
    private DetailedTask getDataFromOtherHost(String key, String authHeader) {
        DetailedTask detailedTask = null;

        try {
            HostInfo currentHostInfo = interactiveQueryService.getCurrentHostInfo();
            KeyQueryMetadata metadata = interactiveQueryService.getKeyQueryMetadata(detailTable, key, Serdes.String().serializer());
            List<HostInfo> allHostsInfo = interactiveQueryService.getAllHostsInfo(detailTable);

            if (currentHostInfo != null && metadata != null) {
                String currentHost = currentHostInfo.host();
                String otherHost = metadata.getActiveHost().host();

                log.debug("Current Host: {}", currentHost);
                log.debug("Other Host: {}", otherHost);

                if (currentHost != null && !currentHost.equals(otherHost)) {
                    HostInfo otherHostInfo = allHostsInfo.stream().filter(h -> h.host().equals(otherHost)).findFirst().get();
                    log.debug("Other Host Info: {}", otherHostInfo);

                    if (otherHostInfo != null) {
                        int otherPort = otherHostInfo.port();

                        String otherUrl = UriComponentsBuilder.newInstance().host(otherHost).port(otherPort).scheme("http")
                                .path("/api/task/processor").queryParam("taskId", key).build().toUriString();

                        log.debug("Trying to get task info from: {}", otherUrl);

                        WebClient webClient = WebClient.create(otherUrl);

                        Mono<DetailedTask> taskMono = webClient.get()
                                .header(HttpHeaders.AUTHORIZATION, authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                                .acceptCharset(StandardCharsets.UTF_8).exchangeToMono(response -> {
                                    log.debug("Status code: {}", response.statusCode());
                                    if (response.statusCode().equals(HttpStatus.OK)) {
                                        return response.bodyToMono(DetailedTask.class);
                                    }

                                    return Mono.just(new DetailedTask());
                                });

                        detailedTask = taskMono.single().block();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error:", e);
        }

        if (detailedTask == null) {
            detailedTask = new DetailedTask();
        }

        return detailedTask;
    }
}
