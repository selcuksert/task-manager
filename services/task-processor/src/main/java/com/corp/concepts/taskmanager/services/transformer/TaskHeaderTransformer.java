package com.corp.concepts.taskmanager.services.transformer;

import com.corp.concepts.taskmanager.common.CustomMessageHeaders;
import com.corp.concepts.taskmanager.models.DetailedTask;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.streams.kstream.ValueTransformerWithKey;
import org.apache.kafka.streams.processor.ProcessorContext;

public class TaskHeaderTransformer implements ValueTransformerWithKey<String, DetailedTask, DetailedTask> {

    ProcessorContext context;

    @Override
    public void init(ProcessorContext context) {
        this.context = context;
    }

    @Override
    public DetailedTask transform(String readOnlyKey, DetailedTask value) {
        Headers headers = context.headers();

        String sentAt = new String(headers.lastHeader(CustomMessageHeaders.MSG_SENT_AT).value());

        value.setGeneratedat(Long.valueOf(sentAt));

        return value;
    }

    @Override
    public void close() {

    }
}
