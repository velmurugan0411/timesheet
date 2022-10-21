package com.techfinite.timesheet.domain;

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

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotNull
    @Column(name = "task_id", nullable = false)
    private Long taskId;

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

    public Long getUserId() {
        return this.userId;
    }

    public UserTask userId(Long userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTaskId() {
        return this.taskId;
    }

    public UserTask taskId(Long taskId) {
        this.setTaskId(taskId);
        return this;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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
            ", userId=" + getUserId() +
            ", taskId=" + getTaskId() +
            "}";
    }
}
