package com.techfinite.timesheet.repository;

import com.techfinite.timesheet.domain.TimeoffType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TimeoffType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimeoffTypeRepository extends JpaRepository<TimeoffType, Long> {}
