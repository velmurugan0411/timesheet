package com.techfinite.timesheet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * User Task
 */
@Schema(description = "User Task")
@Entity
@Table(name = "user_task")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "user_task_id", nullable = false)
    private Long userTaskId;

    @ManyToOne(optional = false)
    @NotNull
    private User userId;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "projectId" }, allowSetters = true)
    private Task taskId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getUserTaskId() {
        return this.userTaskId;
    }

    public UserTask userTaskId(Long userTaskId) {
        this.setUserTaskId(userTaskId);
        return this;
    }

    public void setUserTaskId(Long userTaskId) {
        this.userTaskId = userTaskId;
    }

    public User getUserId() {
        return this.userId;
    }

    public void setUserId(User user) {
        this.userId = user;
    }

    public UserTask userId(User user) {
        this.setUserId(user);
        return this;
    }

    public Task getTaskId() {
        return this.taskId;
    }

    public void setTaskId(Task task) {
        this.taskId = task;
    }

    public UserTask taskId(Task task) {
        this.setTaskId(task);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserTask)) {
            return false;
        }
        return userTaskId != null && userTaskId.equals(((UserTask) o).userTaskId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserTask{" +
            "userTaskId=" + getUserTaskId() +
            "}";
    }
}
