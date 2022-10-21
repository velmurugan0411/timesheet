package com.techfinite.timesheet.service;

import com.techfinite.timesheet.domain.UserTask;
import com.techfinite.timesheet.repository.UserTaskRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserTask}.
 */
@Service
@Transactional
public class UserTaskService {

    private final Logger log = LoggerFactory.getLogger(UserTaskService.class);

    private final UserTaskRepository userTaskRepository;

    public UserTaskService(UserTaskRepository userTaskRepository) {
        this.userTaskRepository = userTaskRepository;
    }

    /**
     * Save a userTask.
     *
     * @param userTask the entity to save.
     * @return the persisted entity.
     */
    public UserTask save(UserTask userTask) {
        log.debug("Request to save UserTask : {}", userTask);
        return userTaskRepository.save(userTask);
    }

    /**
     * Update a userTask.
     *
     * @param userTask the entity to save.
     * @return the persisted entity.
     */
    public UserTask update(UserTask userTask) {
        log.debug("Request to save UserTask : {}", userTask);
        return userTaskRepository.save(userTask);
    }

    /**
     * Partially update a userTask.
     *
     * @param userTask the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserTask> partialUpdate(UserTask userTask) {
        log.debug("Request to partially update UserTask : {}", userTask);

        return userTaskRepository
            .findById(userTask.getUserTaskId())
            .map(existingUserTask -> {
                if (userTask.getUserId() != null) {
                    existingUserTask.setUserId(userTask.getUserId());
                }
                if (userTask.getTaskId() != null) {
                    existingUserTask.setTaskId(userTask.getTaskId());
                }

                return existingUserTask;
            })
            .map(userTaskRepository::save);
    }

    /**
     * Get all the userTasks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserTask> findAll() {
        log.debug("Request to get all UserTasks");
        return userTaskRepository.findAll();
    }

    /**
     * Get one userTask by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserTask> findOne(Long id) {
        log.debug("Request to get UserTask : {}", id);
        return userTaskRepository.findById(id);
    }

    /**
     * Delete the userTask by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UserTask : {}", id);
        userTaskRepository.deleteById(id);
    }
}
