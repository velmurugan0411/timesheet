package com.techfinite.timesheet.repository;

import com.techfinite.timesheet.domain.Timesheet;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Timesheet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimesheetRepository extends JpaRepository<Timesheet, Long> {
    @Query("select timesheet from Timesheet timesheet where timesheet.userId.login = ?#{principal.username}")
    List<Timesheet> findByUserIdIsCurrentUser();
}
