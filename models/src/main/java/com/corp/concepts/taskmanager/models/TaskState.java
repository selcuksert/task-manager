/**
 * Autogenerated by Avro
 *
 * DO NOT EDIT DIRECTLY
 */
package com.corp.concepts.taskmanager.models;
@org.apache.avro.specific.AvroGenerated
public enum TaskState implements org.apache.avro.generic.GenericEnumSymbol<TaskState> {
  COMPLETED, STARTED, NOTSTARTED, DEFERRED, INPROGRESS  ;
  public static final org.apache.avro.Schema SCHEMA$ = new org.apache.avro.Schema.Parser().parse("{\"type\":\"enum\",\"name\":\"TaskState\",\"namespace\":\"com.corp.concepts.taskmanager.models\",\"symbols\":[\"COMPLETED\",\"STARTED\",\"NOTSTARTED\",\"DEFERRED\",\"INPROGRESS\"]}");
  public static org.apache.avro.Schema getClassSchema() { return SCHEMA$; }
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
}
