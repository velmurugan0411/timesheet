package com.techfinite.timesheet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Timesheet Details
 */
@Schema(description = "Timesheet Details")
@Entity
@Table(name = "timesheet_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TimesheetDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "timesheet_details_id", nullable = false)
    private Long timesheetDetailsId;

    @NotNull
    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @NotNull
    @Column(name = "timesheet_id", nullable = false)
    private Long timesheetId;

    @NotNull
    @Column(name = "timeoff_type_id", nullable = false)
    private Long timeoffTypeId;

    @NotNull
    @Column(name = "workdate", nullable = false)
    private Instant workdate;

    @NotNull
    @Column(name = "hours", nullable = false)
    private Integer hours;

    @ManyToOne
    private TimeoffType timeoffTypeId;

    @ManyToOne
    @JsonIgnoreProperties(value = { "projectId" }, allowSetters = true)
    private Task taskId;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "timesheetIds", "timesheetStatusId" }, allowSetters = true)
    private Timesheet timesheetId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getTimesheetDetailsId() {
        return this.timesheetDetailsId;
    }

    public TimesheetDetails timesheetDetailsId(Long timesheetDetailsId) {
        this.setTimesheetDetailsId(timesheetDetailsId);
        return this;
    }

    public void setTimesheetDetailsId(Long timesheetDetailsId) {
        this.timesheetDetailsId = timesheetDetailsId;
    }

    public Long getTaskId() {
        return this.taskId;
    }

    public TimesheetDetails taskId(Long taskId) {
        this.setTaskId(taskId);
        return this;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getTimesheetId() {
        return this.timesheetId;
    }

    public TimesheetDetails timesheetId(Long timesheetId) {
        this.setTimesheetId(timesheetId);
        return this;
    }

    public void setTimesheetId(Long timesheetId) {
        this.timesheetId = timesheetId;
    }

    public Long getTimeoffTypeId() {
        return this.timeoffTypeId;
    }

    public TimesheetDetails timeoffTypeId(Long timeoffTypeId) {
        this.setTimeoffTypeId(timeoffTypeId);
        return this;
    }

    public void setTimeoffTypeId(Long timeoffTypeId) {
        this.timeoffTypeId = timeoffTypeId;
    }

    public Instant getWorkdate() {
        return this.workdate;
    }

    public TimesheetDetails workdate(Instant workdate) {
        this.setWorkdate(workdate);
        return this;
    }

    public void setWorkdate(Instant workdate) {
        this.workdate = workdate;
    }

    public Integer getHours() {
        return this.hours;
    }

    public TimesheetDetails hours(Integer hours) {
        this.setHours(hours);
        return this;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public TimeoffType getTimeoffTypeId() {
        return this.timeoffTypeId;
    }

    public void setTimeoffTypeId(TimeoffType timeoffType) {
        this.timeoffTypeId = timeoffType;
    }

    public TimesheetDetails timeoffTypeId(TimeoffType timeoffType) {
        this.setTimeoffTypeId(timeoffType);
        return this;
    }

    public Task getTaskId() {
        return this.taskId;
    }

    public void setTaskId(Task task) {
        this.taskId = task;
    }

    public TimesheetDetails taskId(Task task) {
        this.setTaskId(task);
        return this;
    }

    public Timesheet getTimesheetId() {
        return this.timesheetId;
    }

    public void setTimesheetId(Timesheet timesheet) {
        this.timesheetId = timesheet;
    }

    public TimesheetDetails timesheetId(Timesheet timesheet) {
        this.setTimesheetId(timesheet);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TimesheetDetails)) {
            return false;
        }
        return timesheetDetailsId != null && timesheetDetailsId.equals(((TimesheetDetails) o).timesheetDetailsId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimesheetDetails{" +
            "timesheetDetailsId=" + getTimesheetDetailsId() +
            ", taskId=" + getTaskId() +
            ", timesheetId=" + getTimesheetId() +
            ", timeoffTypeId=" + getTimeoffTypeId() +
            ", workdate='" + getWorkdate() + "'" +
            ", hours=" + getHours() +
            "}";
    }
}
