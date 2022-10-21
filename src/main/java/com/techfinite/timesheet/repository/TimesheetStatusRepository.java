package com.techfinite.timesheet.repository;

import com.techfinite.timesheet.domain.TimesheetStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TimesheetStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimesheetStatusRepository extends JpaRepository<TimesheetStatus, Long> {}
