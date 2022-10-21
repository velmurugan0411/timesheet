package com.techfinite.timesheet.repository;

import com.techfinite.timesheet.domain.TimesheetDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TimesheetDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimesheetDetailsRepository extends JpaRepository<TimesheetDetails, Long> {}
