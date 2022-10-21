package com.techfinite.timesheet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Timesheet
 */
@Schema(description = "Timesheet")
@Entity
@Table(name = "timesheet")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Timesheet implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "timesheet_id", nullable = false)
    private Long timesheetId;

    @NotNull
    @Column(name = "period_starting_date", nullable = false)
    private Instant periodStartingDate;

    @NotNull
    @Column(name = "period_ending_date", nullable = false)
    private Instant periodEndingDate;

    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "timesheetId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "timeoffTypeId", "taskId", "timesheetId" }, allowSetters = true)
    private Set<TimesheetDetails> timesheetIds = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    private TimesheetStatus timesheetStatusId;

    @ManyToOne(optional = false)
    @NotNull
    private User userId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getTimesheetId() {
        return this.timesheetId;
    }

    public Timesheet timesheetId(Long timesheetId) {
        this.setTimesheetId(timesheetId);
        return this;
    }

    public void setTimesheetId(Long timesheetId) {
        this.timesheetId = timesheetId;
    }

    public Instant getPeriodStartingDate() {
        return this.periodStartingDate;
    }

    public Timesheet periodStartingDate(Instant periodStartingDate) {
        this.setPeriodStartingDate(periodStartingDate);
        return this;
    }

    public void setPeriodStartingDate(Instant periodStartingDate) {
        this.periodStartingDate = periodStartingDate;
    }

    public Instant getPeriodEndingDate() {
        return this.periodEndingDate;
    }

    public Timesheet periodEndingDate(Instant periodEndingDate) {
        this.setPeriodEndingDate(periodEndingDate);
        return this;
    }

    public void setPeriodEndingDate(Instant periodEndingDate) {
        this.periodEndingDate = periodEndingDate;
    }

    public String getNotes() {
        return this.notes;
    }

    public Timesheet notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<TimesheetDetails> getTimesheetIds() {
        return this.timesheetIds;
    }

    public void setTimesheetIds(Set<TimesheetDetails> timesheetDetails) {
        if (this.timesheetIds != null) {
            this.timesheetIds.forEach(i -> i.setTimesheetId(null));
        }
        if (timesheetDetails != null) {
            timesheetDetails.forEach(i -> i.setTimesheetId(this));
        }
        this.timesheetIds = timesheetDetails;
    }

    public Timesheet timesheetIds(Set<TimesheetDetails> timesheetDetails) {
        this.setTimesheetIds(timesheetDetails);
        return this;
    }

    public Timesheet addTimesheetId(TimesheetDetails timesheetDetails) {
        this.timesheetIds.add(timesheetDetails);
        timesheetDetails.setTimesheetId(this);
        return this;
    }

    public Timesheet removeTimesheetId(TimesheetDetails timesheetDetails) {
        this.timesheetIds.remove(timesheetDetails);
        timesheetDetails.setTimesheetId(null);
        return this;
    }

    public TimesheetStatus getTimesheetStatusId() {
        return this.timesheetStatusId;
    }

    public void setTimesheetStatusId(TimesheetStatus timesheetStatus) {
        this.timesheetStatusId = timesheetStatus;
    }

    public Timesheet timesheetStatusId(TimesheetStatus timesheetStatus) {
        this.setTimesheetStatusId(timesheetStatus);
        return this;
    }

    public User getUserId() {
        return this.userId;
    }

    public void setUserId(User user) {
        this.userId = user;
    }

    public Timesheet userId(User user) {
        this.setUserId(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Timesheet)) {
            return false;
        }
        return timesheetId != null && timesheetId.equals(((Timesheet) o).timesheetId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Timesheet{" +
            "timesheetId=" + getTimesheetId() +
            ", periodStartingDate='" + getPeriodStartingDate() + "'" +
            ", periodEndingDate='" + getPeriodEndingDate() + "'" +
            ", notes='" + getNotes() + "'" +
            "}";
    }
}
