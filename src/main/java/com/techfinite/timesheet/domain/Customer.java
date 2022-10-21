package com.techfinite.timesheet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Customer
 */
@Schema(description = "Customer")
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @NotNull
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @NotNull
    @Column(name = "description", nullable = false)
    private Long description;

    @Column(name = "active_ind")
    private Boolean activeInd;

    @OneToMany(mappedBy = "customerId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "projectIds", "customerId" }, allowSetters = true)
    private Set<Project> customerIds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getCustomerId() {
        return this.customerId;
    }

    public Customer customerId(Long customerId) {
        this.setCustomerId(customerId);
        return this;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return this.customerName;
    }

    public Customer customerName(String customerName) {
        this.setCustomerName(customerName);
        return this;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getDescription() {
        return this.description;
    }

    public Customer description(Long description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(Long description) {
        this.description = description;
    }

    public Boolean getActiveInd() {
        return this.activeInd;
    }

    public Customer activeInd(Boolean activeInd) {
        this.setActiveInd(activeInd);
        return this;
    }

    public void setActiveInd(Boolean activeInd) {
        this.activeInd = activeInd;
    }

    public Set<Project> getCustomerIds() {
        return this.customerIds;
    }

    public void setCustomerIds(Set<Project> projects) {
        if (this.customerIds != null) {
            this.customerIds.forEach(i -> i.setCustomerId(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setCustomerId(this));
        }
        this.customerIds = projects;
    }

    public Customer customerIds(Set<Project> projects) {
        this.setCustomerIds(projects);
        return this;
    }

    public Customer addCustomerId(Project project) {
        this.customerIds.add(project);
        project.setCustomerId(this);
        return this;
    }

    public Customer removeCustomerId(Project project) {
        this.customerIds.remove(project);
        project.setCustomerId(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return customerId != null && customerId.equals(((Customer) o).customerId);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "customerId=" + getCustomerId() +
            ", customerName='" + getCustomerName() + "'" +
            ", description=" + getDescription() +
            ", activeInd='" + getActiveInd() + "'" +
            "}";
    }
}
