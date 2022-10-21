package com.techfinite.timesheet.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Timesheet Status
 */
@Schema(description = "Timesheet Status")
@Entity
@Table(name = "timesheet_status")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TimesheetStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "timesheet_status_id", nullable = false)
    private Long timesheetStatusId;

    @Column(name = "status_name")
    private String statusName;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getTimesheetStatusId() {
        return this.timesheetStatusId;
    }

    public TimesheetStatus timesheetStatusId(Long timesheetStatusId) {
        this.setTimesheetStatusId(timesheetStatusId);
        return this;
    }

    public void setTimesheetStatusId(Long timesheetStatusId) {
        this.timesheetStatusId = timesheetStatusId;
    }

    public String getStatusName() {
        return this.statusName;
    }

    public TimesheetStatus statusName(String statusName) {
        this.setStatusName(statusName);
        return this;
    }

    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TimesheetStatus)) {
            return false;
        }
        return timesheetStatusId != null && timesheetStatusId.equals(((TimesheetStatus) o).timesheetStatusId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimesheetStatus{" +
            "timesheetStatusId=" + getTimesheetStatusId() +
            ", statusName='" + getStatusName() + "'" +
            "}";
    }
}
