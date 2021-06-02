package com.corp.concepts.taskmanager.services.transformer;

import com.corp.concepts.taskmanager.models.DetailedTask;
import org.apache.kafka.streams.kstream.ValueTransformerWithKey;
import org.apache.kafka.streams.processor.ProcessorContext;

public class TaskValueTransformer implements ValueTransformerWithKey<String, DetailedTask, DetailedTask> {

    ProcessorContext context;

    @Override
    public void init(ProcessorContext context) {
        this.context = context;
    }

    @Override
    public DetailedTask transform(String readOnlyKey, DetailedTask value) {
        long timestamp = context.timestamp();

        value.setGeneratedat(timestamp);

        return value;
    }

    @Override
    public void close() {

    }
}
