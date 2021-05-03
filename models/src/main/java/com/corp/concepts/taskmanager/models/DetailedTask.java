/**
 * Autogenerated by Avro
 *
 * DO NOT EDIT DIRECTLY
 */
package com.corp.concepts.taskmanager.models;

import org.apache.avro.generic.GenericArray;
import org.apache.avro.specific.SpecificData;
import org.apache.avro.util.Utf8;
import org.apache.avro.message.BinaryMessageEncoder;
import org.apache.avro.message.BinaryMessageDecoder;
import org.apache.avro.message.SchemaStore;

@org.apache.avro.specific.AvroGenerated
public class DetailedTask extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  private static final long serialVersionUID = 6558587718470287447L;
  public static final org.apache.avro.Schema SCHEMA$ = new org.apache.avro.Schema.Parser().parse("{\"type\":\"record\",\"name\":\"DetailedTask\",\"namespace\":\"com.corp.concepts.taskmanager.models\",\"fields\":[{\"name\":\"id\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"user\",\"type\":{\"type\":\"record\",\"name\":\"User\",\"fields\":[{\"name\":\"id\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"firstname\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"lastname\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}}]}},{\"name\":\"duedate\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"title\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"details\",\"type\":{\"type\":\"string\",\"avro.java.string\":\"String\"}},{\"name\":\"status\",\"type\":{\"type\":\"enum\",\"name\":\"TaskState\",\"symbols\":[\"COMPLETED\",\"INPROGRESS\",\"DEFERRED\",\"NOTSTARTED\"]}}]}");
  public static org.apache.avro.Schema getClassSchema() { return SCHEMA$; }

  private static SpecificData MODEL$ = new SpecificData();

  private static final BinaryMessageEncoder<DetailedTask> ENCODER =
      new BinaryMessageEncoder<DetailedTask>(MODEL$, SCHEMA$);

  private static final BinaryMessageDecoder<DetailedTask> DECODER =
      new BinaryMessageDecoder<DetailedTask>(MODEL$, SCHEMA$);

  /**
   * Return the BinaryMessageEncoder instance used by this class.
   * @return the message encoder used by this class
   */
  public static BinaryMessageEncoder<DetailedTask> getEncoder() {
    return ENCODER;
  }

  /**
   * Return the BinaryMessageDecoder instance used by this class.
   * @return the message decoder used by this class
   */
  public static BinaryMessageDecoder<DetailedTask> getDecoder() {
    return DECODER;
  }

  /**
   * Create a new BinaryMessageDecoder instance for this class that uses the specified {@link SchemaStore}.
   * @param resolver a {@link SchemaStore} used to find schemas by fingerprint
   * @return a BinaryMessageDecoder instance for this class backed by the given SchemaStore
   */
  public static BinaryMessageDecoder<DetailedTask> createDecoder(SchemaStore resolver) {
    return new BinaryMessageDecoder<DetailedTask>(MODEL$, SCHEMA$, resolver);
  }

  /**
   * Serializes this DetailedTask to a ByteBuffer.
   * @return a buffer holding the serialized data for this instance
   * @throws java.io.IOException if this instance could not be serialized
   */
  public java.nio.ByteBuffer toByteBuffer() throws java.io.IOException {
    return ENCODER.encode(this);
  }

  /**
   * Deserializes a DetailedTask from a ByteBuffer.
   * @param b a byte buffer holding serialized data for an instance of this class
   * @return a DetailedTask instance decoded from the given buffer
   * @throws java.io.IOException if the given bytes could not be deserialized into an instance of this class
   */
  public static DetailedTask fromByteBuffer(
      java.nio.ByteBuffer b) throws java.io.IOException {
    return DECODER.decode(b);
  }

   private java.lang.String id;
   private com.corp.concepts.taskmanager.models.User user;
   private java.lang.String duedate;
   private java.lang.String title;
   private java.lang.String details;
   private com.corp.concepts.taskmanager.models.TaskState status;

  /**
   * Default constructor.  Note that this does not initialize fields
   * to their default values from the schema.  If that is desired then
   * one should use <code>newBuilder()</code>.
   */
  public DetailedTask() {}

  /**
   * All-args constructor.
   * @param id The new value for id
   * @param user The new value for user
   * @param duedate The new value for duedate
   * @param title The new value for title
   * @param details The new value for details
   * @param status The new value for status
   */
  public DetailedTask(java.lang.String id, com.corp.concepts.taskmanager.models.User user, java.lang.String duedate, java.lang.String title, java.lang.String details, com.corp.concepts.taskmanager.models.TaskState status) {
    this.id = id;
    this.user = user;
    this.duedate = duedate;
    this.title = title;
    this.details = details;
    this.status = status;
  }

  public org.apache.avro.specific.SpecificData getSpecificData() { return MODEL$; }
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call.
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return id;
    case 1: return user;
    case 2: return duedate;
    case 3: return title;
    case 4: return details;
    case 5: return status;
    default: throw new IndexOutOfBoundsException("Invalid index: " + field$);
    }
  }

  // Used by DatumReader.  Applications should not call.
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: id = value$ != null ? value$.toString() : null; break;
    case 1: user = (com.corp.concepts.taskmanager.models.User)value$; break;
    case 2: duedate = value$ != null ? value$.toString() : null; break;
    case 3: title = value$ != null ? value$.toString() : null; break;
    case 4: details = value$ != null ? value$.toString() : null; break;
    case 5: status = (com.corp.concepts.taskmanager.models.TaskState)value$; break;
    default: throw new IndexOutOfBoundsException("Invalid index: " + field$);
    }
  }

  /**
   * Gets the value of the 'id' field.
   * @return The value of the 'id' field.
   */
  public java.lang.String getId() {
    return id;
  }


  /**
   * Sets the value of the 'id' field.
   * @param value the value to set.
   */
  public void setId(java.lang.String value) {
    this.id = value;
  }

  /**
   * Gets the value of the 'user' field.
   * @return The value of the 'user' field.
   */
  public com.corp.concepts.taskmanager.models.User getUser() {
    return user;
  }


  /**
   * Sets the value of the 'user' field.
   * @param value the value to set.
   */
  public void setUser(com.corp.concepts.taskmanager.models.User value) {
    this.user = value;
  }

  /**
   * Gets the value of the 'duedate' field.
   * @return The value of the 'duedate' field.
   */
  public java.lang.String getDuedate() {
    return duedate;
  }


  /**
   * Sets the value of the 'duedate' field.
   * @param value the value to set.
   */
  public void setDuedate(java.lang.String value) {
    this.duedate = value;
  }

  /**
   * Gets the value of the 'title' field.
   * @return The value of the 'title' field.
   */
  public java.lang.String getTitle() {
    return title;
  }


  /**
   * Sets the value of the 'title' field.
   * @param value the value to set.
   */
  public void setTitle(java.lang.String value) {
    this.title = value;
  }

  /**
   * Gets the value of the 'details' field.
   * @return The value of the 'details' field.
   */
  public java.lang.String getDetails() {
    return details;
  }


  /**
   * Sets the value of the 'details' field.
   * @param value the value to set.
   */
  public void setDetails(java.lang.String value) {
    this.details = value;
  }

  /**
   * Gets the value of the 'status' field.
   * @return The value of the 'status' field.
   */
  public com.corp.concepts.taskmanager.models.TaskState getStatus() {
    return status;
  }


  /**
   * Sets the value of the 'status' field.
   * @param value the value to set.
   */
  public void setStatus(com.corp.concepts.taskmanager.models.TaskState value) {
    this.status = value;
  }

  /**
   * Creates a new DetailedTask RecordBuilder.
   * @return A new DetailedTask RecordBuilder
   */
  public static com.corp.concepts.taskmanager.models.DetailedTask.Builder newBuilder() {
    return new com.corp.concepts.taskmanager.models.DetailedTask.Builder();
  }

  /**
   * Creates a new DetailedTask RecordBuilder by copying an existing Builder.
   * @param other The existing builder to copy.
   * @return A new DetailedTask RecordBuilder
   */
  public static com.corp.concepts.taskmanager.models.DetailedTask.Builder newBuilder(com.corp.concepts.taskmanager.models.DetailedTask.Builder other) {
    if (other == null) {
      return new com.corp.concepts.taskmanager.models.DetailedTask.Builder();
    } else {
      return new com.corp.concepts.taskmanager.models.DetailedTask.Builder(other);
    }
  }

  /**
   * Creates a new DetailedTask RecordBuilder by copying an existing DetailedTask instance.
   * @param other The existing instance to copy.
   * @return A new DetailedTask RecordBuilder
   */
  public static com.corp.concepts.taskmanager.models.DetailedTask.Builder newBuilder(com.corp.concepts.taskmanager.models.DetailedTask other) {
    if (other == null) {
      return new com.corp.concepts.taskmanager.models.DetailedTask.Builder();
    } else {
      return new com.corp.concepts.taskmanager.models.DetailedTask.Builder(other);
    }
  }

  /**
   * RecordBuilder for DetailedTask instances.
   */
  @org.apache.avro.specific.AvroGenerated
  public static class Builder extends org.apache.avro.specific.SpecificRecordBuilderBase<DetailedTask>
    implements org.apache.avro.data.RecordBuilder<DetailedTask> {

    private java.lang.String id;
    private com.corp.concepts.taskmanager.models.User user;
    private com.corp.concepts.taskmanager.models.User.Builder userBuilder;
    private java.lang.String duedate;
    private java.lang.String title;
    private java.lang.String details;
    private com.corp.concepts.taskmanager.models.TaskState status;

    /** Creates a new Builder */
    private Builder() {
      super(SCHEMA$);
    }

    /**
     * Creates a Builder by copying an existing Builder.
     * @param other The existing Builder to copy.
     */
    private Builder(com.corp.concepts.taskmanager.models.DetailedTask.Builder other) {
      super(other);
      if (isValidValue(fields()[0], other.id)) {
        this.id = data().deepCopy(fields()[0].schema(), other.id);
        fieldSetFlags()[0] = other.fieldSetFlags()[0];
      }
      if (isValidValue(fields()[1], other.user)) {
        this.user = data().deepCopy(fields()[1].schema(), other.user);
        fieldSetFlags()[1] = other.fieldSetFlags()[1];
      }
      if (other.hasUserBuilder()) {
        this.userBuilder = com.corp.concepts.taskmanager.models.User.newBuilder(other.getUserBuilder());
      }
      if (isValidValue(fields()[2], other.duedate)) {
        this.duedate = data().deepCopy(fields()[2].schema(), other.duedate);
        fieldSetFlags()[2] = other.fieldSetFlags()[2];
      }
      if (isValidValue(fields()[3], other.title)) {
        this.title = data().deepCopy(fields()[3].schema(), other.title);
        fieldSetFlags()[3] = other.fieldSetFlags()[3];
      }
      if (isValidValue(fields()[4], other.details)) {
        this.details = data().deepCopy(fields()[4].schema(), other.details);
        fieldSetFlags()[4] = other.fieldSetFlags()[4];
      }
      if (isValidValue(fields()[5], other.status)) {
        this.status = data().deepCopy(fields()[5].schema(), other.status);
        fieldSetFlags()[5] = other.fieldSetFlags()[5];
      }
    }

    /**
     * Creates a Builder by copying an existing DetailedTask instance
     * @param other The existing instance to copy.
     */
    private Builder(com.corp.concepts.taskmanager.models.DetailedTask other) {
      super(SCHEMA$);
      if (isValidValue(fields()[0], other.id)) {
        this.id = data().deepCopy(fields()[0].schema(), other.id);
        fieldSetFlags()[0] = true;
      }
      if (isValidValue(fields()[1], other.user)) {
        this.user = data().deepCopy(fields()[1].schema(), other.user);
        fieldSetFlags()[1] = true;
      }
      this.userBuilder = null;
      if (isValidValue(fields()[2], other.duedate)) {
        this.duedate = data().deepCopy(fields()[2].schema(), other.duedate);
        fieldSetFlags()[2] = true;
      }
      if (isValidValue(fields()[3], other.title)) {
        this.title = data().deepCopy(fields()[3].schema(), other.title);
        fieldSetFlags()[3] = true;
      }
      if (isValidValue(fields()[4], other.details)) {
        this.details = data().deepCopy(fields()[4].schema(), other.details);
        fieldSetFlags()[4] = true;
      }
      if (isValidValue(fields()[5], other.status)) {
        this.status = data().deepCopy(fields()[5].schema(), other.status);
        fieldSetFlags()[5] = true;
      }
    }

    /**
      * Gets the value of the 'id' field.
      * @return The value.
      */
    public java.lang.String getId() {
      return id;
    }


    /**
      * Sets the value of the 'id' field.
      * @param value The value of 'id'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setId(java.lang.String value) {
      validate(fields()[0], value);
      this.id = value;
      fieldSetFlags()[0] = true;
      return this;
    }

    /**
      * Checks whether the 'id' field has been set.
      * @return True if the 'id' field has been set, false otherwise.
      */
    public boolean hasId() {
      return fieldSetFlags()[0];
    }


    /**
      * Clears the value of the 'id' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearId() {
      id = null;
      fieldSetFlags()[0] = false;
      return this;
    }

    /**
      * Gets the value of the 'user' field.
      * @return The value.
      */
    public com.corp.concepts.taskmanager.models.User getUser() {
      return user;
    }


    /**
      * Sets the value of the 'user' field.
      * @param value The value of 'user'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setUser(com.corp.concepts.taskmanager.models.User value) {
      validate(fields()[1], value);
      this.userBuilder = null;
      this.user = value;
      fieldSetFlags()[1] = true;
      return this;
    }

    /**
      * Checks whether the 'user' field has been set.
      * @return True if the 'user' field has been set, false otherwise.
      */
    public boolean hasUser() {
      return fieldSetFlags()[1];
    }

    /**
     * Gets the Builder instance for the 'user' field and creates one if it doesn't exist yet.
     * @return This builder.
     */
    public com.corp.concepts.taskmanager.models.User.Builder getUserBuilder() {
      if (userBuilder == null) {
        if (hasUser()) {
          setUserBuilder(com.corp.concepts.taskmanager.models.User.newBuilder(user));
        } else {
          setUserBuilder(com.corp.concepts.taskmanager.models.User.newBuilder());
        }
      }
      return userBuilder;
    }

    /**
     * Sets the Builder instance for the 'user' field
     * @param value The builder instance that must be set.
     * @return This builder.
     */

    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setUserBuilder(com.corp.concepts.taskmanager.models.User.Builder value) {
      clearUser();
      userBuilder = value;
      return this;
    }

    /**
     * Checks whether the 'user' field has an active Builder instance
     * @return True if the 'user' field has an active Builder instance
     */
    public boolean hasUserBuilder() {
      return userBuilder != null;
    }

    /**
      * Clears the value of the 'user' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearUser() {
      user = null;
      userBuilder = null;
      fieldSetFlags()[1] = false;
      return this;
    }

    /**
      * Gets the value of the 'duedate' field.
      * @return The value.
      */
    public java.lang.String getDuedate() {
      return duedate;
    }


    /**
      * Sets the value of the 'duedate' field.
      * @param value The value of 'duedate'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setDuedate(java.lang.String value) {
      validate(fields()[2], value);
      this.duedate = value;
      fieldSetFlags()[2] = true;
      return this;
    }

    /**
      * Checks whether the 'duedate' field has been set.
      * @return True if the 'duedate' field has been set, false otherwise.
      */
    public boolean hasDuedate() {
      return fieldSetFlags()[2];
    }


    /**
      * Clears the value of the 'duedate' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearDuedate() {
      duedate = null;
      fieldSetFlags()[2] = false;
      return this;
    }

    /**
      * Gets the value of the 'title' field.
      * @return The value.
      */
    public java.lang.String getTitle() {
      return title;
    }


    /**
      * Sets the value of the 'title' field.
      * @param value The value of 'title'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setTitle(java.lang.String value) {
      validate(fields()[3], value);
      this.title = value;
      fieldSetFlags()[3] = true;
      return this;
    }

    /**
      * Checks whether the 'title' field has been set.
      * @return True if the 'title' field has been set, false otherwise.
      */
    public boolean hasTitle() {
      return fieldSetFlags()[3];
    }


    /**
      * Clears the value of the 'title' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearTitle() {
      title = null;
      fieldSetFlags()[3] = false;
      return this;
    }

    /**
      * Gets the value of the 'details' field.
      * @return The value.
      */
    public java.lang.String getDetails() {
      return details;
    }


    /**
      * Sets the value of the 'details' field.
      * @param value The value of 'details'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setDetails(java.lang.String value) {
      validate(fields()[4], value);
      this.details = value;
      fieldSetFlags()[4] = true;
      return this;
    }

    /**
      * Checks whether the 'details' field has been set.
      * @return True if the 'details' field has been set, false otherwise.
      */
    public boolean hasDetails() {
      return fieldSetFlags()[4];
    }


    /**
      * Clears the value of the 'details' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearDetails() {
      details = null;
      fieldSetFlags()[4] = false;
      return this;
    }

    /**
      * Gets the value of the 'status' field.
      * @return The value.
      */
    public com.corp.concepts.taskmanager.models.TaskState getStatus() {
      return status;
    }


    /**
      * Sets the value of the 'status' field.
      * @param value The value of 'status'.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder setStatus(com.corp.concepts.taskmanager.models.TaskState value) {
      validate(fields()[5], value);
      this.status = value;
      fieldSetFlags()[5] = true;
      return this;
    }

    /**
      * Checks whether the 'status' field has been set.
      * @return True if the 'status' field has been set, false otherwise.
      */
    public boolean hasStatus() {
      return fieldSetFlags()[5];
    }


    /**
      * Clears the value of the 'status' field.
      * @return This builder.
      */
    public com.corp.concepts.taskmanager.models.DetailedTask.Builder clearStatus() {
      status = null;
      fieldSetFlags()[5] = false;
      return this;
    }

    @Override
    @SuppressWarnings("unchecked")
    public DetailedTask build() {
      try {
        DetailedTask record = new DetailedTask();
        record.id = fieldSetFlags()[0] ? this.id : (java.lang.String) defaultValue(fields()[0]);
        if (userBuilder != null) {
          try {
            record.user = this.userBuilder.build();
          } catch (org.apache.avro.AvroMissingFieldException e) {
            e.addParentField(record.getSchema().getField("user"));
            throw e;
          }
        } else {
          record.user = fieldSetFlags()[1] ? this.user : (com.corp.concepts.taskmanager.models.User) defaultValue(fields()[1]);
        }
        record.duedate = fieldSetFlags()[2] ? this.duedate : (java.lang.String) defaultValue(fields()[2]);
        record.title = fieldSetFlags()[3] ? this.title : (java.lang.String) defaultValue(fields()[3]);
        record.details = fieldSetFlags()[4] ? this.details : (java.lang.String) defaultValue(fields()[4]);
        record.status = fieldSetFlags()[5] ? this.status : (com.corp.concepts.taskmanager.models.TaskState) defaultValue(fields()[5]);
        return record;
      } catch (org.apache.avro.AvroMissingFieldException e) {
        throw e;
      } catch (java.lang.Exception e) {
        throw new org.apache.avro.AvroRuntimeException(e);
      }
    }
  }

  @SuppressWarnings("unchecked")
  private static final org.apache.avro.io.DatumWriter<DetailedTask>
    WRITER$ = (org.apache.avro.io.DatumWriter<DetailedTask>)MODEL$.createDatumWriter(SCHEMA$);

  @Override public void writeExternal(java.io.ObjectOutput out)
    throws java.io.IOException {
    WRITER$.write(this, SpecificData.getEncoder(out));
  }

  @SuppressWarnings("unchecked")
  private static final org.apache.avro.io.DatumReader<DetailedTask>
    READER$ = (org.apache.avro.io.DatumReader<DetailedTask>)MODEL$.createDatumReader(SCHEMA$);

  @Override public void readExternal(java.io.ObjectInput in)
    throws java.io.IOException {
    READER$.read(this, SpecificData.getDecoder(in));
  }

  @Override protected boolean hasCustomCoders() { return true; }

  @Override public void customEncode(org.apache.avro.io.Encoder out)
    throws java.io.IOException
  {
    out.writeString(this.id);

    this.user.customEncode(out);

    out.writeString(this.duedate);

    out.writeString(this.title);

    out.writeString(this.details);

    out.writeEnum(this.status.ordinal());

  }

  @Override public void customDecode(org.apache.avro.io.ResolvingDecoder in)
    throws java.io.IOException
  {
    org.apache.avro.Schema.Field[] fieldOrder = in.readFieldOrderIfDiff();
    if (fieldOrder == null) {
      this.id = in.readString();

      if (this.user == null) {
        this.user = new com.corp.concepts.taskmanager.models.User();
      }
      this.user.customDecode(in);

      this.duedate = in.readString();

      this.title = in.readString();

      this.details = in.readString();

      this.status = com.corp.concepts.taskmanager.models.TaskState.values()[in.readEnum()];

    } else {
      for (int i = 0; i < 6; i++) {
        switch (fieldOrder[i].pos()) {
        case 0:
          this.id = in.readString();
          break;

        case 1:
          if (this.user == null) {
            this.user = new com.corp.concepts.taskmanager.models.User();
          }
          this.user.customDecode(in);
          break;

        case 2:
          this.duedate = in.readString();
          break;

        case 3:
          this.title = in.readString();
          break;

        case 4:
          this.details = in.readString();
          break;

        case 5:
          this.status = com.corp.concepts.taskmanager.models.TaskState.values()[in.readEnum()];
          break;

        default:
          throw new java.io.IOException("Corrupt ResolvingDecoder.");
        }
      }
    }
  }
}









