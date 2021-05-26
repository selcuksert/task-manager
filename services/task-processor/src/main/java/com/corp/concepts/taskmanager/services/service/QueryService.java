package com.corp.concepts.taskmanager.services.service;

import com.corp.concepts.taskmanager.models.DetailedTask;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyQueryMetadata;
import org.apache.kafka.streams.state.HostInfo;
import org.apache.kafka.streams.state.QueryableStoreTypes;
import org.apache.kafka.streams.state.ReadOnlyKeyValueStore;
import org.springframework.cloud.stream.binder.kafka.streams.InteractiveQueryService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Log4j2
public class QueryService {
    private final InteractiveQueryService interactiveQueryService;

    public QueryService(InteractiveQueryService interactiveQueryService) {
        this.interactiveQueryService = interactiveQueryService;
    }

    /**
     * This method is for getting DetailedTask data with a key in KTable store
     * from related Kafka Stream processor instance by using metadata for given key.
     * <p>
     * With this information the function builds the correct REST endpoint for this instance
     * and invokes an HTTP GET request with it and returns response if it cannot find it in
     * local KTable store as local state only represents a partial view of the entire application
     * state which in fact is the nature of a KTable.
     *
     * @param kTableName KTable name to query
     * @param key        taskId
     * @param authHeader Authorization header that contains JWT
     * @return Retrieved data from KStream apps. Returns empty object if there is no data retrieved.
     */
    public DetailedTask getMaterializedData(String kTableName, String key, String authHeader) {
        DetailedTask detailedTask = null;

        try {
            HostInfo currentHostInfo = interactiveQueryService.getCurrentHostInfo();
            KeyQueryMetadata metadata = interactiveQueryService.getKeyQueryMetadata(kTableName, key, Serdes.String().serializer());
            List<HostInfo> allHostsInfo = interactiveQueryService.getAllHostsInfo(kTableName);

            if (currentHostInfo != null && metadata != null) {
                String currentHost = currentHostInfo.host();
                String otherHost = metadata.getActiveHost().host();

                log.debug("Current Host: {}", currentHost);
                log.debug("Other Host: {}", otherHost);

                if (currentHost != null) {
                    if (currentHost.equals(otherHost)) {
                        ReadOnlyKeyValueStore<String, DetailedTask> detailStore = interactiveQueryService.getQueryableStore(kTableName,
                                QueryableStoreTypes.keyValueStore());

                        detailedTask = detailStore.get(key);
                    } else {
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
