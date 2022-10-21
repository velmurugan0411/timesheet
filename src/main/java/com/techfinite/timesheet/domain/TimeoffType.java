package com.techfinite.timesheet.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * TimeOff Type
 */
@Schema(description = "TimeOff Type")
@Entity
@Table(name = "timeoff_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TimeoffType implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "timeoff_type_id", nullable = false)
    private Long timeoffTypeId;

    @Column(name = "type_name")
    private String typeName;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getTimeoffTypeId() {
        return this.timeoffTypeId;
    }

    public TimeoffType timeoffTypeId(Long timeoffTypeId) {
        this.setTimeoffTypeId(timeoffTypeId);
        return this;
    }

    public void setTimeoffTypeId(Long timeoffTypeId) {
        this.timeoffTypeId = timeoffTypeId;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public TimeoffType typeName(String typeName) {
        this.setTypeName(typeName);
        return this;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TimeoffType)) {
            return false;
        }
        return timeoffTypeId != null && timeoffTypeId.equals(((TimeoffType) o).timeoffTypeId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TimeoffType{" +
            "timeoffTypeId=" + getTimeoffTypeId() +
            ", typeName='" + getTypeName() + "'" +
            "}";
    }
}
