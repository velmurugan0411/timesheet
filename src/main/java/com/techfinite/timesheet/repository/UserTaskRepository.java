package com.techfinite.timesheet.repository;

import com.techfinite.timesheet.domain.UserTask;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserTaskRepository extends JpaRepository<UserTask, Long> {
    @Query("select userTask from UserTask userTask where userTask.userId.login = ?#{principal.username}")
    List<UserTask> findByUserIdIsCurrentUser();
}
